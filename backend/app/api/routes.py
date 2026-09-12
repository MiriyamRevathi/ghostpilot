from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.models.schemas import DeveloperContext, DeveloperSignals, DiagnosticItem
from app.services.engine import GhostPilotEngine
from app.analyzer.ast_parser import CodeASTAnalyzer

router = APIRouter(prefix="/api")
engine = GhostPilotEngine()

@router.get("/health")
def health_check():
    return {"status": "online", "system": "GhostPilot", "version": "1.0.0"}

@router.get("/context")
def get_context():
    return {
        "context": engine.context.model_dump(),
        "signals": engine.signals.model_dump(),
        "diagnostics": [d.model_dump() for d in engine.diagnostics],
    }

@router.post("/context")
def update_context(data: Dict[str, Any]):
    if "context" in data:
        engine.context = DeveloperContext(**data["context"])
    if "signals" in data:
        engine.signals = DeveloperSignals(**data["signals"])
    if "diagnostics" in data:
        engine.diagnostics = [DiagnosticItem(**d) for d in data["diagnostics"]]
    return {"status": "updated", "context": engine.context.model_dump()}

@router.post("/predict")
def predict():
    return engine.predict_intent()

@router.post("/analyze-code")
def analyze_code(payload: Dict[str, Any]):
    code = payload.get("code", engine.context.source_code)
    lang = payload.get("language", engine.context.language)
    return CodeASTAnalyzer.analyze(code, lang)

@router.get("/diagnostics")
def get_diagnostics():
    return [d.model_dump() for d in engine.diagnostics]

@router.post("/diagnostics")
def add_diagnostic(diag: DiagnosticItem):
    engine.diagnostics.insert(0, diag)
    engine.signals.diagnostic_count = len(engine.diagnostics)
    engine.signals.error_count = sum(1 for d in engine.diagnostics if d.severity == "error")
    return {"status": "added", "count": len(engine.diagnostics)}

@router.delete("/diagnostics/{diag_id}")
def delete_diagnostic(diag_id: str):
    engine.diagnostics = [d for d in engine.diagnostics if d.id != diag_id]
    engine.signals.diagnostic_count = len(engine.diagnostics)
    engine.signals.error_count = sum(1 for d in engine.diagnostics if d.severity == "error")
    return {"status": "deleted", "remaining": len(engine.diagnostics)}

@router.get("/suggestions/latest")
def get_latest_suggestion():
    all_cached = engine.cache.get_all()
    if all_cached:
        return all_cached[-1]
    return None

@router.post("/suggestions/apply")
def apply_suggestion(payload: Dict[str, Any]):
    fix = payload.get("suggestedFix")
    target_file = payload.get("targetFile", engine.context.active_file)
    # Apply fix to active source_code state
    if fix and target_file == engine.context.active_file:
        original = payload.get("originalCode", "")
        if original and original in engine.context.source_code:
            engine.context.source_code = engine.context.source_code.replace(original, fix)
        else:
            engine.context.source_code = f"// Applied fix:\n{fix}\n"
    # Resolve diagnostics
    engine.diagnostics = []
    engine.signals.diagnostic_count = 0
    engine.signals.error_count = 0
    engine.signals.terminal_activity = 0
    return {"status": "applied", "source_code": engine.context.source_code}

@router.post("/suggestions/dismiss")
def dismiss_suggestion(payload: Dict[str, Any]):
    return {"status": "dismissed"}

@router.get("/cache")
def get_cache_entries():
    return {
        "entries": engine.cache.get_all(),
        "stats": engine.cache.get_stats(),
    }

@router.delete("/cache")
def clear_cache():
    cleared = engine.cache.clear()
    return {"status": "cleared", "cleared_count": cleared}

@router.get("/latency")
def get_latency():
    return engine.last_latency

@router.get("/settings")
def get_settings():
    return engine.settings

@router.post("/settings")
def update_settings(new_settings: Dict[str, Any]):
    engine.settings.update(new_settings)
    engine.cache.ttl_seconds = engine.settings.get("cacheDurationSec", 300)
    return engine.settings

@router.get("/inference/status")
def get_inference_status():
    return engine.ollama.check_availability()

@router.get("/vscode/status")
def get_vscode_status():
    return {
        "connected": True,
        "extension_version": "1.0.0",
        "active_workspace": "TaskManager",
        "last_ping": "now",
    }
