from typing import List, Dict, Any
from app.models.schemas import DeveloperSignals

FEATURE_NAMES = [
    "pause_duration",
    "typing_speed",
    "backspace_count",
    "cursor_movement",
    "mouse_activity",
    "error_count",
    "terminal_activity",
    "diagnostic_count",
    "code_complexity",
    "time_on_problem",
]

def extract_feature_vector(signals: DeveloperSignals) -> List[float]:
    """Convert DeveloperSignals object into a standardized numerical feature vector."""
    return [
        float(signals.pause_duration),
        float(signals.typing_speed),
        float(signals.backspace_count),
        float(signals.cursor_movement),
        float(signals.mouse_activity),
        float(signals.error_count),
        float(signals.terminal_activity),
        float(signals.diagnostic_count),
        float(signals.code_complexity),
        float(signals.time_on_problem),
    ]

def identify_supporting_signals(signals: DeveloperSignals) -> List[str]:
    """Identify which human-readable signals most strongly contributed to the predicted state."""
    reasons = []
    if signals.terminal_activity > 0:
        reasons.append("terminal_error")
    if signals.pause_duration >= 3.0:
        reasons.append("long_pause")
    if signals.diagnostic_count > 0:
        reasons.append("cursor_near_diagnostic")
    if signals.backspace_count >= 3:
        reasons.append("repeated_edit")
    if signals.typing_speed > 60:
        reasons.append("rapid_typing_flow")
    if signals.time_on_problem > 30:
        reasons.append("prolonged_troubleshooting")
    if signals.code_complexity > 5:
        reasons.append("high_branching_complexity")
    if signals.cursor_movement > 3.0:
        reasons.append("frequent_code_navigation")
    
    if not reasons:
        reasons.append("steady_development_cadence")
    return reasons
