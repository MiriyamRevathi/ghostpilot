from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

IntentType = Literal[
    "DEBUG_ERROR",
    "WRITE_UNIT_TEST",
    "EXPLAIN_ERROR",
    "REFACTOR_CODE",
    "WRITE_DOCUMENTATION",
    "NAVIGATE_CODE",
    "SEARCH_CODEBASE",
    "RUN_TEST",
    "FIX_SYNTAX",
    "REVIEW_CODE",
]

CognitiveLoadLevel = Literal["LOW", "MEDIUM", "HIGH"]

class DeveloperSignals(BaseModel):
    typing_speed: float = Field(default=0.0, description="Characters per minute")
    pause_duration: float = Field(default=0.0, description="Current typing pause in seconds")
    backspace_count: int = Field(default=0, description="Backspaces in observation window")
    cursor_movement: float = Field(default=0.0, description="Cursor line delta/velocity")
    mouse_activity: float = Field(default=0.0, description="Mouse events per second")
    error_count: int = Field(default=0, description="Total active errors")
    terminal_activity: float = Field(default=0.0, description="Terminal exit/activity flag")
    diagnostic_count: int = Field(default=0, description="Active LSP diagnostics")
    code_complexity: float = Field(default=1.0, description="Estimated cyclomatic complexity")
    time_on_problem: float = Field(default=0.0, description="Seconds on current problematic scope")

class DeveloperContext(BaseModel):
    project_name: str = "TaskManager"
    active_file: str = "src/services/UserService.ts"
    language: str = "TypeScript"
    cursor_line: int = 16
    cursor_column: int = 45
    code_complexity: float = 3.0
    diagnostic_count: int = 1
    source_code: str = ""
    selected_text: Optional[str] = None

class DiagnosticItem(BaseModel):
    id: str
    type: str
    message: str
    file: str
    line: int
    column: int
    severity: str = "error"
    stack_trace: Optional[str] = None
    related_code_snippet: Optional[str] = None

class PredictionResult(BaseModel):
    intent: IntentType
    confidence: float
    supporting_signals: List[str]
    timestamp: str
    features: DeveloperSignals
    cognitive_load: CognitiveLoadLevel
    speculative_status: str

class SuggestionResponse(BaseModel):
    id: str
    prediction_id: str
    intent: IntentType
    confidence: float
    root_cause: str
    suggested_fix: str
    original_code: str
    target_file: str
    target_line: int
    generated_test: str
    explanation: str
    timestamp: str
    speculatively_prepared: bool
    status: str
