from pymongo import MongoClient
from pymongo.database import Database
from typing import Optional
from config.settings import settings

class MongoDB:
    """MongoDB connection manager for fashion-cube database"""

    _instance: Optional['MongoDB'] = None

    def __init__(self, uri: str = None):
        self.uri = uri or settings.mongodb_uri
        self.client = MongoClient(self.uri)
        self.db: Database = self.client["fashion-cube"]

    @classmethod
    def get_instance(cls) -> 'MongoDB':
        """Singleton pattern for database connection"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @property
    def products(self):
        return self.db["products"]

    @property
    def carts(self):
        return self.db["carts"]

    @property
    def users(self):
        return self.db["users"]

    @property
    def variants(self):
        return self.db["variants"]

    @property
    def departments(self):
        return self.db["departments"]

    @property
    def categories(self):
        return self.db["categories"]

    # New collections for agents
    @property
    def agent_logs(self):
        return self.db["agent_logs"]

    @property
    def price_history(self):
        return self.db["price_history"]

    @property
    def promotions(self):
        return self.db["promotions"]

# Global database instance
db = MongoDB.get_instance()
