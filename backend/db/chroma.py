import chromadb

client=chromadb.PersistentClient(path="./vectorstore")

product_collection=client.get_or_create_collection(name="products")
ragcollection = client.get_or_create_collection(
    name="ragcollection"
)
