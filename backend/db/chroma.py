import chromadb

client=chromadb.createPersistentClient(path="./vectorstore")

product_collection=client.get_or_create_collection(name="products")

