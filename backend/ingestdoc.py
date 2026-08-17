from db.chroma import ragcollection
from embeddingmodel import model
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os



splitter=RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20,
)

FOLDER="assets"

for filename,i in zip(os.listdir(FOLDER),range(0,100)):

    if not filename.endswith(".txt"):
        continue

    filepath=os.path.join(FOLDER, filename)

    with open(filepath, "r", encoding="utf-8") as f:
        content=f.read()

    if not content.strip():
        continue

    chunks=splitter.split_text(content)

    for j,chunk in enumerate(chunks):
        embedding=model.encode(chunk).tolist()
        metadata={
            "source":filename,
            "chunk_index":f"{filename}-{j}"
        }

        ragcollection.add(
            ids=[f"{filename}-{j}"],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[chunk]

        )

    print(f"Added {filename}: {len(chunks)} chunks")


print("Ingestion completed.")

    



