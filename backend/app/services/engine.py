import time
import uuid
from typing import Dict, Any, Optional, List
from app.models.schemas import DeveloperContext, DeveloperSignals, DiagnosticItem, PredictionResult
from app.ml.classifier import IntentClassifier
from app.analyzer.ast_parser import CodeASTAnalyzer
from app.cache.speculative_cache import SpeculativeCache
from app.inference.ollama_adapter import OllamaAdapter

class GhostPilotEngine:
    def __init__(self):
        self.context = DeveloperContext(
            project_name="TaskManager",
            active_file="src/services/UserService.ts",
            language="TypeScript",
            cursor_line=16,
            cursor_column=45,
            code_complexity=3.0,
            diagnostic_count=1,
            source_code=(
                "export class UserService {\n"
                "  public getUserDisplayName(id: string): string {\n"
                "    return this.users.find(u => u.id === id).name;\n"
                "  }\n"
                "}"
            ),
        )
        self.signals = DeveloperSignals(
            typing_speed=14.0,
            pause_duration=4.2,
            backspace_count=3,
            cursor_movement=1.2,
            mouse_activity=2.1,
            error_count=1,
            terminal_activity=1.0,
            diagnostic_count=1,
            code_complexity=3.0,
            time_on_problem=42.0,
        )
        self.diagnostics: List[DiagnosticItem] = [
            DiagnosticItem(
                id="diag_001",
                type="TypeError",
                message="Cannot read properties of undefined (reading 'name')",
                file="src/services/UserService.ts",
                line=16,
                column=45,
                severity="error",
                stack_trace="TypeError: Cannot read properties of undefined (reading 'name')\n    at UserService.getUserDisplayName",
                related_code_snippet="return this.users.find(u => u.id === id).name;",
            )
        ]
        self.classifier = IntentClassifier()
        self.cache = SpeculativeCache(ttl_seconds=300)
        self.ollama = OllamaAdapter()
        self.recent_predictions: List[Dict[str, Any]] = []
        self.last_latency: Dict[str, Any] = {
            "contextCollectionMs": 8.2,
            "featureExtractionMs": 2.4,
            "intentPredictionMs": 5.1,
            "speculativeAnalysisMs": 182.0,
            "cacheRetrievalMs": 1.1,
            "totalPreparationMs": 198.8,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        self.settings = {
            "behavioralTrackingEnabled": True,
            "gazeTrackingEnabled": False,
            "speculativeGenerationEnabled": True,
            "confidenceThreshold": 0.80,
            "localLlmEnabled": False,
            "ollamaEndpoint": "http://localhost:11434",
            "modelName": "codellama",
            "cacheDurationSec": 300,
            "privacyStrictLocal": True,
        }

    def predict_intent(self) -> Dict[str, Any]:
        t0 = time.perf_counter()
        
        # 1. Context collection
        t1 = time.perf_counter()
        context_time_ms = round((t1 - t0) * 1000, 2)

        # 2. Feature extraction
        intent, confidence, supporting_signals, cognitive_load = self.classifier.predict(self.signals)
        t2 = time.perf_counter()
        feature_intent_time_ms = round((t2 - t1) * 1000, 2)

        speculative_status = "IDLE"
        suggestion = None

        # 3. Speculative Trigger Check (> threshold)
        if self.settings.get("speculativeGenerationEnabled") and confidence >= self.settings.get("confidenceThreshold", 0.80):
            speculative_status = "PREPARING"
            t_spec_start = time.perf_counter()
            suggestion = self._run_speculative_synthesis(intent, confidence)
            t_spec_end = time.perf_counter()
            spec_time_ms = round((t_spec_end - t_spec_start) * 1000, 2)
            speculative_status = "READY"
        else:
            spec_time_ms = 0.0

        total_time_ms = round((time.perf_counter() - t0) * 1000, 2)

        self.last_latency = {
            "contextCollectionMs": max(1.2, context_time_ms),
            "featureExtractionMs": 1.5,
            "intentPredictionMs": max(2.1, feature_intent_time_ms),
            "speculativeAnalysisMs": spec_time_ms,
            "cacheRetrievalMs": 1.2 if suggestion and suggestion.get("from_cache") else 0.8,
            "totalPreparationMs": total_time_ms,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        result = {
            "intent": intent,
            "confidence": confidence,
            "supporting_signals": supporting_signals,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "features": self.signals.model_dump(),
            "cognitive_load": cognitive_load,
            "speculative_status": speculative_status,
            "active_suggestion": suggestion,
        }

        self.recent_predictions.insert(0, result)
        if len(self.recent_predictions) > 20:
            self.recent_predictions.pop()

        return result

    def _run_speculative_synthesis(self, intent: str, confidence: float) -> Dict[str, Any]:
        diag = self.diagnostics[0] if self.diagnostics else None
        target_file = self.context.active_file
        target_line = self.context.cursor_line
        snippet = diag.related_code_snippet if diag and diag.related_code_snippet else "return this.users.find(u => u.id === id).name;"
        diag_id = diag.id if diag else "generic"

        # Check Cache
        chash = self.cache.compute_context_hash(target_file, target_line, snippet, diag_id)
        cached = self.cache.get(chash)
        if cached:
            cached["from_cache"] = True
            return cached

        # Synthesize fix
        fix_data = self.ollama.generate_speculative_fix(
            error_type=diag.type if diag else "TypeError",
            message=diag.message if diag else "Unknown diagnostic",
            code_line=snippet,
            file_path=target_file,
            line_num=target_line,
            use_ollama=self.settings.get("localLlmEnabled", False)
        )

        suggestion_id = f"sug_{uuid.uuid4().hex[:8]}"
        prepared = {
            "id": suggestion_id,
            "prediction_id": f"pred_{uuid.uuid4().hex[:6]}",
            "intent": intent,
            "confidence": confidence,
            "rootCause": fix_data["rootCause"],
            "suggestedFix": fix_data["suggestedFix"],
            "originalCode": snippet,
            "targetFile": target_file,
            "targetLine": target_line,
            "generatedTest": fix_data["generatedTest"],
            "explanation": fix_data["explanation"],
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "speculatively_prepared": True,
            "status": "prepared",
            "from_cache": False,
        }

        self.cache.put(chash, prepared)
        return prepared
