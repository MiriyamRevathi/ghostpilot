import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional
from app.inference.local_rules import LocalRuleInference

class OllamaAdapter:
    def __init__(self, endpoint: str = "http://localhost:11434", model: str = "codellama"):
        self.endpoint = endpoint.rstrip("/")
        self.model = model

    def check_availability(self) -> Dict[str, Any]:
        """Check if local Ollama daemon is reachable without hanging."""
        try:
            req = urllib.request.Request(f"{self.endpoint}/api/tags", headers={"User-Agent": "GhostPilot/1.0"})
            with urllib.request.urlopen(req, timeout=1.5) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    models = [m.get("name") for m in data.get("models", [])]
                    return {
                        "available": True,
                        "endpoint": self.endpoint,
                        "installed_models": models,
                        "active_model": self.model if self.model in models else (models[0] if models else self.model)
                    }
        except Exception:
            pass

        return {
            "available": False,
            "endpoint": self.endpoint,
            "installed_models": [],
            "active_model": self.model,
            "fallback": "Local AST & Rule-based synthesis engine active",
        }

    def generate_speculative_fix(
        self,
        error_type: str,
        message: str,
        code_line: str,
        file_path: str,
        line_num: int,
        use_ollama: bool = True
    ) -> Dict[str, Any]:
        # Always obtain rule-based baseline
        baseline = LocalRuleInference.generate_fix(error_type, message, code_line, file_path, line_num)

        if not use_ollama:
            baseline["generator"] = "local_rules"
            return baseline

        # Attempt Ollama if available
        status = self.check_availability()
        if not status.get("available"):
            baseline["generator"] = "local_rules (ollama offline)"
            return baseline

        prompt = (
            f"Developer error in {file_path}:{line_num}\n"
            f"Diagnostic: [{error_type}] {message}\n"
            f"Failing Code: {code_line}\n"
            f"Provide root cause, candidate fix, and unit test in JSON format."
        )

        try:
            req_data = json.dumps({
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }).encode("utf-8")

            req = urllib.request.Request(
                f"{self.endpoint}/api/generate",
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=3.0) as resp:
                if resp.status == 200:
                    payload = json.loads(resp.read().decode("utf-8"))
                    text = payload.get("response", "")
                    parsed = json.loads(text)
                    return {
                        "rootCause": parsed.get("rootCause", baseline["rootCause"]),
                        "suggestedFix": parsed.get("suggestedFix", baseline["suggestedFix"]),
                        "generatedTest": parsed.get("generatedTest", baseline["generatedTest"]),
                        "explanation": parsed.get("explanation", baseline["explanation"]),
                        "generator": f"ollama ({self.model})"
                    }
        except Exception:
            pass

        baseline["generator"] = "local_rules (fallback)"
        return baseline
