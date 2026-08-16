from fastapi import FastAPI
from pydantic import BaseModel
app=FastAPI()
from db.chroma import product_collection
from embeddingmodel import model



class ProductEmbedding(BaseModel):
    mongoId:str
    content:str
    metadata:dict

@app.post("/add_product_embedding")
def addProductEmbedding(product:ProductEmbedding):
    product_embedding=model.encode(product.content).tolist()

    product_collection.add(
        ids=[product.mongoId],
        embeddings=[product_embedding],
        metadatas=[product.metadata],
        documents=[product.content]



    )



    return {
        "message":"product added to embedding successfully",
        "success":True
    }


@app.post("/search_product_embedding")
def searchProductEmbedding(query:str):
    query_embedding=model.encode(query).tolist()

    results=product_collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    return {
        "results":results["ids"][0]
    }