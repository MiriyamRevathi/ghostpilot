from app.models.schemas import DeveloperSignals
from app.ml.classifier import IntentClassifier

def test_intent_prediction_debug_error():
    classifier = IntentClassifier()
    # High error, pause, backspace, and terminal activity should yield DEBUG_ERROR
    signals = DeveloperSignals(
        pause_duration=6.5,
        typing_speed=2.0,
        backspace_count=5,
        cursor_movement=0.5,
        mouse_activity=1.5,
        error_count=2,
        terminal_activity=1.0,
        diagnostic_count=2,
        code_complexity=3.0,
        time_on_problem=50.0,
    )
    intent, confidence, supporting, load = classifier.predict(signals)
    assert intent == "DEBUG_ERROR"
    assert confidence > 0.50
    assert "terminal_error" in supporting
    assert load in ["MEDIUM", "HIGH"]

def test_intent_prediction_navigation():
    classifier = IntentClassifier()
    # High cursor and mouse activity with 0 errors should predict navigation
    signals = DeveloperSignals(
        pause_duration=0.2,
        typing_speed=0.0,
        backspace_count=0,
        cursor_movement=8.5,
        mouse_activity=7.0,
        error_count=0,
        terminal_activity=0.0,
        diagnostic_count=0,
        code_complexity=2.0,
        time_on_problem=5.0,
    )
    intent, confidence, supporting, load = classifier.predict(signals)
    assert intent in ["NAVIGATE_CODE", "SEARCH_CODEBASE", "REVIEW_CODE"]
    assert load == "LOW"
