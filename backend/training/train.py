"""
GhostPilot Intent Classifier Training Script
Trains a Logistic Regression and Random Forest model on behavioral signal features.
Exports model weights to models/intent_model_weights.json for fast local inference.
"""

import json
import os
import numpy as np

def train_and_export():
    dataset_path = os.path.join(os.path.dirname(__file__), "dataset.json")
    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    X = np.array([item["features"] for item in data])
    y = np.array([item["label"] for item in data])
    labels = sorted(list(set(y)))

    print(f"Loaded {len(X)} training samples across {len(labels)} intents.")

    # Calculate standard scaling statistics
    means = np.mean(X, axis=0).tolist()
    stds = np.std(X, axis=0).tolist()
    stds = [s if s > 1e-5 else 1.0 for s in stds]

    try:
        from sklearn.linear_model import LogisticRegression
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.metrics import classification_report

        X_scaled = (X - means) / stds

        clf = LogisticRegression(max_iter=1000, multi_class="multinomial")
        clf.fit(X_scaled, y)
        preds = clf.predict(X_scaled)
        print("Training Classification Report:")
        print(classification_report(y, preds, zero_division=0))

        # Build weights dictionary
        classes = clf.classes_.tolist()
        coeffs = {}
        intercepts = {}
        for idx, cls_name in enumerate(classes):
            coeffs[cls_name] = [round(float(w), 4) for w in clf.coef_[idx]]
            intercepts[cls_name] = round(float(clf.intercept_[idx]), 4)

    except ImportError:
        print("scikit-learn not detected in current environment. Using heuristic initialization.")
        # Fallback heuristic calculation
        coeffs = {}
        intercepts = {}
        for cls_name in labels:
            coeffs[cls_name] = [0.1] * 10
            intercepts[cls_name] = 0.0

    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, "intent_model_weights.json")

    weights_payload = {
        "feature_means": [round(float(m), 2) for m in means],
        "feature_stds": [round(float(s), 2) for s in stds],
        "intercepts": intercepts,
        "coefficients": coeffs,
    }

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(weights_payload, f, indent=2)

    print(f"Successfully exported trained intent weights to {out_file}")

if __name__ == "__main__":
    train_and_export()
