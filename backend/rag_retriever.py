import pickle
import faiss
from sentence_transformers import SentenceTransformer

index = faiss.read_index("knowledge_base/cybersecurity.index")

with open("knowledge_base/chunks.pkl", "rb") as file:
    chunks = pickle.load(file)

model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve_knowledge(query, top_k=3):
    embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    scores, indices = index.search(embedding.astype("float32"), top_k)

    results = []

    for score, index_value in zip(scores[0], indices[0]):
        if index_value != -1:
            results.append({
                "title": chunks[index_value]["title"],
                "content": chunks[index_value]["content"],
                "score": round(float(score), 4)
            })

    return results