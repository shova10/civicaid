import os
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from ai_engine.vectorizer import SAVED_MODELS_DIR

DUPLICATE_THRESHOLD = 0.80

VECTORIZER_PATH = os.path.join(SAVED_MODELS_DIR, "vectorizer.pkl")


def check_duplicate(new_complaint_text, existing_complaints):
    if not existing_complaints.exists():
        return False

    with open(VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)

    existing_texts = [obj.description for obj in existing_complaints]

    existing_vectors = vectorizer.transform(existing_texts)
    new_vector = vectorizer.transform([new_complaint_text])

    for i in range(existing_vectors.shape[0]):
        similarity = cosine_similarity(new_vector, existing_vectors[i])

        if similarity[0][0] >= DUPLICATE_THRESHOLD:
            return True

    return False