import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "honest_iq_ai"

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        if not MONGO_URI:
            print("[MongoDB] No MONGO_URI found in .env. Skipping connection.")
            return
        
        try:
            cls.client = AsyncIOMotorClient(MONGO_URI)
            cls.db = cls.client[DB_NAME]
            # Verify connection
            await cls.client.admin.command('ping')
            print(f"[MongoDB] Connected successfully to {DB_NAME}")
        except Exception as e:
            print(f"[MongoDB] Connection failed: {e}")

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            print("[MongoDB] Connection closed.")

async def get_nosql_db():
    return MongoDB.db
