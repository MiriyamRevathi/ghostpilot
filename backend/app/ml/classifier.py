import math
import json
import os
from typing import Tuple, List, Dict
from app.models.schemas import DeveloperSignals, IntentType, CognitiveLoadLevel
from app.ml.features import extract_feature_vector, identify_supporting_signals

INTENTS: List[IntentType] = [
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

class IntentClassifier:
    def __init__(self, weights_path: str = None):
        if weights_path is None:
            # Look in parent / models directory
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            weights_path = os.path.join(base_dir, "models", "intent_model_weights.json")
            if not os.path.exists(weights_path):
                weights_path = os.path.join(os.getcwd(), "models", "intent_model_weights.json")
        
        self.weights_path = weights_path
        self.weights = self._load_weights()

    def _load_weights(self) -> Dict:
        if os.path.exists(self.weights_path):
            try:
                with open(self.weights_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return self._default_weights()

    def _default_weights(self) -> Dict:
        return {
            "feature_means": [3.5, 45.0, 4.0, 2.5, 3.8, 1.2, 0.35, 1.4, 4.2, 45.0],
            "feature_stds": [2.8, 35.0, 4.5, 2.2, 2.9, 1.6, 0.48, 1.8, 3.1, 50.0],
            "intercepts": {intent: -0.5 for intent in INTENTS},
            "coefficients": {intent: [0.1] * 10 for intent in INTENTS},
        }

    def predict(self, signals: DeveloperSignals) -> Tuple[IntentType, float, List[str], CognitiveLoadLevel]:
        vec = extract_feature_vector(signals)
        means = self.weights.get("feature_means", [0.0] * 10)
        stds = self.weights.get("feature_stds", [1.0] * 10)

        # Standardize features
        std_vec = []
        for val, mean, std in zip(vec, means, stds):
            safe_std = std if std > 1e-5 else 1.0
            std_vec.append((val - mean) / safe_std)

        # Logit scores
        scores: Dict[str, float] = {}
        intercepts = self.weights.get("intercepts", {})
        coeffs = self.weights.get("coefficients", {})

        for intent in INTENTS:
            b = intercepts.get(intent, 0.0)
            w = coeffs.get(intent, [0.0] * 10)
            dot = sum(x * c for x, c in zip(std_vec, w))
            scores[intent] = b + dot

        # Softmax
        max_score = max(scores.values())
        exp_scores = {k: math.exp(v - max_score) for k, v in scores.items()}
        sum_exp = sum(exp_scores.values())
        probs = {k: v / sum_exp for k, v in exp_scores.items()}

        best_intent = max(probs, key=probs.get)
        confidence = round(probs[best_intent], 4)

        # Cognitive load assessment based on behavioral signals
        friction_score = (
            (signals.pause_duration / 5.0) * 0.3 +
            (signals.backspace_count / 6.0) * 0.3 +
            (signals.error_count / 2.0) * 0.25 +
            (signals.time_on_problem / 60.0) * 0.15
        )
        if friction_score < 0.35:
            cognitive_load: CognitiveLoadLevel = "LOW"
        elif friction_score < 0.75:
            cognitive_load: CognitiveLoadLevel = "MEDIUM"
        else:
            cognitive_load: CognitiveLoadLevel = "HIGH"

        supporting_signals = identify_supporting_signals(signals)
        return best_intent, confidence, supporting_signals, cognitive_load
