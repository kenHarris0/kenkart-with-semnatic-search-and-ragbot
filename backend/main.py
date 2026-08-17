from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage
)
from db.chroma import product_collection,ragcollection
from embeddingmodel import model
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
load_dotenv()


app=FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductEmbedding(BaseModel):
    mongoId:str
    content:str
    metadata:dict

    
class SearchQuery(BaseModel):
    query: str


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
def searchProductEmbedding(data:SearchQuery):
    if not data.query:
        return {
            "message":"query is required",
            "success":False
        }   
    query_embedding=model.encode(data.query).tolist()

    results=product_collection.query(
        query_embeddings=[query_embedding],
        n_results=4
    )
    print("QUERY:", data.query)
    print("DOCUMENTS:", results["documents"])
    print("DISTANCES:", results["distances"])

    return {
        "results":results["ids"][0],
        "success":True
    }


#rag part

class ChatQuery(BaseModel):
    query: str
    history:list[dict]

llm= ChatOpenAI(model_name="gpt-4o-mini", temperature=0.2)

@app.post('/chat')
def chat_with_rag(data:ChatQuery):
    query_embedding=model.encode(data.query).tolist()

    results=ragcollection.query(
       query_embeddings=[query_embedding],
       n_results=5
    )

    final_docs=results["documents"][0]
    context= '\n\n'.join(final_docs)

    messages = [
        SystemMessage(
            content=f"""
You are the KenKart shopping assistant.

Answer the user's question using the provided context.

If the answer cannot be found in the context,
say that you don't have enough information.

Context:
{context}
"""
        )
    ]

    for msg in data.history:
        if msg["role"]=="user":
            messages.append(HumanMessage(content=msg["content"]))

        elif msg["role"] == "assistant":
            messages.append(
                AIMessage(content=msg["content"])
            )
    messages.append(HumanMessage(content=data.query))

    prompt = messages
    print("\nQUERY:", data.query)
    print("\nRETRIEVED DOCS:")
    for i, doc in enumerate(final_docs):
        print(f"\n--- DOC {i} ---")
        print(doc)

    print("\nDISTANCES:")
    print(results["distances"])

    response=llm.invoke(prompt)
    return{
        "answer":response.content,
        "success":True
    }