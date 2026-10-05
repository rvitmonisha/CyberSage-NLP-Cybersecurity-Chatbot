from pathlib import Path
import pickle
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

knowledge_file = Path("knowledge_base/cybersecurity_knowledge.txt")
output_dir = Path("knowledge_base")
index_file = output_dir / "cybersecurity.index"
chunks_file = output_dir / "chunks.pkl"

text = knowledge_file.read_text(encoding="utf-8")

titles = {
    "Phishing",
    "Malware",
    "Ransomware",
    "Password Security",
    "Multi-Factor Authentication",
    "Social Engineering",
    "Account Security",
    "Network Security",
    "Cybersecurity Incident Response",
    "Safe Browsing",
    "Public Wi-Fi",
    "Data Protection"
}

lines = [line.strip() for line in text.splitlines()]

chunks = []
current_title = None
current_content = []

for line in lines:
    if not line:
        continue

    if line in titles:
        if current_title and current_content:
            chunks.append({
                "title": current_title,
                "content": " ".join(current_content)
            })

        current_title = line
        current_content = []
    elif current_title:
        current_content.append(line)

if current_title and current_content:
    chunks.append({
        "title": current_title,
        "content": " ".join(current_content)
    })

if not chunks:
    raise ValueError("No knowledge chunks were found.")

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = [chunk["content"] for chunk in chunks]

embeddings = model.encode(
    texts,
    convert_to_numpy=True,
    normalize_embeddings=True
)

embeddings = np.asarray(embeddings).astype("float32")

if embeddings.ndim == 1:
    embeddings = embeddings.reshape(1, -1)

dimension = embeddings.shape[1]

index = faiss.IndexFlatIP(dimension)
index.add(embeddings)

faiss.write_index(index, str(index_file))

with open(chunks_file, "wb") as file:
    pickle.dump(chunks, file)

print(f"Knowledge chunks: {len(chunks)}")
print(f"Embedding dimension: {dimension}")
print("FAISS index created successfully!")
print(f"Index: {index_file}")
print(f"Chunks: {chunks_file}")