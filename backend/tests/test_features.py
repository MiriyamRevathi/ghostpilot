from app.models.schemas import DeveloperSignals
from app.ml.features import extract_feature_vector, identify_supporting_signals

def test_feature_extraction():
    signals = DeveloperSignals(
        typing_speed=40.0,
        pause_duration=4.5,
        backspace_count=5,
        cursor_movement=1.2,
        mouse_activity=2.0,
        error_count=2,
        terminal_activity=1.0,
        diagnostic_count=3,
        code_complexity=4.0,
        time_on_problem=65.0,
    )
    vec = extract_feature_vector(signals)
    assert len(vec) == 10
    assert vec[0] == 4.5
    assert vec[1] == 40.0
    assert vec[2] == 5.0
    assert vec[6] == 1.0

def test_supporting_signals():
    signals = DeveloperSignals(
        typing_speed=0.0,
        pause_duration=5.5,
        backspace_count=4,
        error_count=1,
        terminal_activity=1.0,
        diagnostic_count=2,
        time_on_problem=45.0,
    )
    reasons = identify_supporting_signals(signals)
    assert "terminal_error" in reasons
    assert "long_pause" in reasons
    assert "cursor_near_diagnostic" in reasons
    assert "repeated_edit" in reasons
