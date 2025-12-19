from typing import Dict, Optional, List
from bson import ObjectId
from config.mongodb import db

async def get_user_profile(user_id: str) -> Optional[Dict]:
    """Get user from MongoDB"""
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        # Don't return password hash
        user.pop("password", None)
        user["_id"] = str(user["_id"])
    return user

async def get_user_by_email(email: str) -> Optional[Dict]:
    """Find user by email"""
    user = db.users.find_one({"email": email})
    if user:
        user.pop("password", None)
        user["_id"] = str(user["_id"])
    return user

async def get_user_orders(user_id: str) -> List[Dict]:
    """Get user's order history (placeholder - extend as needed)"""
    # This would connect to an orders collection once implemented
    return []

async def update_user_preferences(user_id: str, preferences: Dict) -> bool:
    """Update user preferences"""
    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"preferences": preferences}}
    )
    return result.modified_count > 0

async def get_user_tier(user_id: str) -> str:
    """Get user tier based on total spent (placeholder logic)"""
    user = await get_user_profile(user_id)
    if not user:
        return "guest"

    # This is placeholder logic - extend based on your business rules
    total_spent = user.get("total_spent", 0)

    if total_spent > 1000:
        return "vip"
    elif total_spent > 500:
        return "gold"
    elif total_spent > 100:
        return "silver"
    else:
        return "bronze"
