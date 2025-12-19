from typing import Dict, List, Optional
from bson import ObjectId
from config.mongodb import db

async def get_user_cart_items(user_id: str) -> Dict:
    """Get cart from MongoDB"""
    cart = db.carts.find_one({"userId": user_id})
    if not cart:
        return {"items": {}, "totalQty": 0, "totalPrice": 0}
    if "_id" in cart:
        cart["_id"] = str(cart["_id"])
    return cart

async def calculate_cart_total(cart: Dict) -> float:
    """Calculate cart total with potential discounts"""
    base_total = cart.get("totalPrice", 0)
    # Agent can apply dynamic discounts here
    return base_total

async def get_cart_item_count(user_id: str) -> int:
    """Get total number of items in cart"""
    cart = await get_user_cart_items(user_id)
    return cart.get("totalQty", 0)

async def validate_cart_inventory(cart: Dict) -> Dict:
    """Check if all cart items are still in stock"""
    results = {"valid": True, "out_of_stock": []}
    items = cart.get("items", {})

    for item_id, cart_item in items.items():
        product = db.products.find_one({"_id": ObjectId(item_id)})
        if not product or product.get("quantity", 0) < cart_item.get("qty", 0):
            results["valid"] = False
            results["out_of_stock"].append({
                "product_id": item_id,
                "requested": cart_item.get("qty", 0),
                "available": product.get("quantity", 0) if product else 0
            })

    return results

async def get_cart_summary(user_id: str) -> Dict:
    """Get cart summary with details"""
    cart = await get_user_cart_items(user_id)
    inventory_check = await validate_cart_inventory(cart)

    return {
        "cart": cart,
        "inventory_valid": inventory_check["valid"],
        "out_of_stock": inventory_check["out_of_stock"],
        "total_items": cart.get("totalQty", 0),
        "total_price": cart.get("totalPrice", 0)
    }
