from typing import List, Dict, Optional
from bson import ObjectId
from config.mongodb import db
from tools.api_client import api_client

async def search_products_mongodb(query: str, max_results: int = 10) -> List[Dict]:
    """Search products directly in MongoDB"""
    regex = {"$regex": query, "$options": "i"}
    results = db.products.find({
        "$or": [
            {"title": regex},
            {"description": regex},
            {"category": regex},
            {"department": regex}
        ]
    }).limit(max_results)
    return [_serialize_doc(doc) for doc in results]

async def get_product_by_id(product_id: str) -> Optional[Dict]:
    """Get single product from MongoDB"""
    doc = db.products.find_one({"_id": ObjectId(product_id)})
    return _serialize_doc(doc) if doc else None

async def get_products_by_category(category: str, limit: int = 50) -> List[Dict]:
    """Filter products by category"""
    docs = db.products.find({"category": category}).limit(limit)
    return [_serialize_doc(doc) for doc in docs]

async def get_products_by_department(department: str, limit: int = 50) -> List[Dict]:
    """Filter products by department"""
    docs = db.products.find({"department": department}).limit(limit)
    return [_serialize_doc(doc) for doc in docs]

async def get_product_variants(product_id: str) -> List[Dict]:
    """Get all variants for a product"""
    docs = db.variants.find({"productID": product_id})
    return [_serialize_doc(doc) for doc in docs]

async def get_departments() -> List[Dict]:
    """Get all departments"""
    docs = db.departments.find({})
    return [_serialize_doc(doc) for doc in docs]

async def get_categories() -> List[Dict]:
    """Get all categories"""
    docs = db.categories.find({})
    return [_serialize_doc(doc) for doc in docs]

def _serialize_doc(doc: Dict) -> Dict:
    """Convert MongoDB ObjectId to string"""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc
