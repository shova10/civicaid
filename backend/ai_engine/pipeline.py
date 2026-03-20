import os
from complaints.models import Complaint
from ai_engine.classifier import (
    train_category_classifier,
    train_priority_classifier,
    predict_category,
    predict_priority,
)
from ai_engine.duplicate import check_duplicate
from ai_engine.vectorizer import SAVED_MODELS_DIR, train_vectorizer


def models_exist():
    paths = [
        os.path.join(SAVED_MODELS_DIR, "category_vectorizer.pkl"),
        os.path.join(SAVED_MODELS_DIR, "category_classifier.pkl"),
        os.path.join(SAVED_MODELS_DIR, "priority_vectorizer.pkl"),
        os.path.join(SAVED_MODELS_DIR, "priority_classifier.pkl"),
        os.path.join(SAVED_MODELS_DIR, "vectorizer.pkl"),
    ]
    return all(os.path.exists(p) for p in paths)


def train_all():
    train_vectorizer()
    train_category_classifier()
    train_priority_classifier()


def analyze(complaint):
    if not models_exist():
        train_all()

    text = complaint.description

    ai_category, ai_confidence = predict_category(text)
    ai_priority, _ = predict_priority(text)

    existing_complaints = Complaint.objects.exclude(id=complaint.id)
    is_duplicate = check_duplicate(text, existing_complaints)

    complaint.ai_category = ai_category
    complaint.ai_priority = ai_priority
    complaint.ai_confidence = round(float(ai_confidence), 4)
    complaint.is_duplicate = is_duplicate
    complaint.save()