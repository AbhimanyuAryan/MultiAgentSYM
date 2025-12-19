"""
Test script to verify Phase 2 setup
This script tests that all modules can be imported and basic functionality works
"""

import asyncio
from config import settings, db
from tools import api_client
from tools.catalog_tools import search_products_mongodb, get_departments, get_categories
from tools.cart_tools import get_user_cart_items
from tools.user_tools import get_user_by_email
from agents.events import EventType, event_bus
from core import (
    EcommerceAgentError,
    PricingConflictError,
    NodeJSAPIError
)

async def test_configuration():
    """Test configuration loading"""
    print("\n=== Testing Configuration ===")
    print(f"✅ MongoDB URI: {settings.mongodb_uri}")
    print(f"✅ Redis URL: {settings.redis_url}")
    print(f"✅ Node.js API URL: {settings.nodejs_api_url}")
    print(f"✅ Default Agent Model: {settings.default_agent_model}")

async def test_mongodb_connection():
    """Test MongoDB connection"""
    print("\n=== Testing MongoDB Connection ===")
    try:
        # Test connection
        product_count = db.products.count_documents({})
        user_count = db.users.count_documents({})
        cart_count = db.carts.count_documents({})

        print(f"✅ Connected to MongoDB")
        print(f"   - Products: {product_count}")
        print(f"   - Users: {user_count}")
        print(f"   - Carts: {cart_count}")

        # Test getting departments
        departments = await get_departments()
        print(f"   - Departments: {len(departments)}")

        # Test getting categories
        categories = await get_categories()
        print(f"   - Categories: {len(categories)}")

        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

async def test_catalog_tools():
    """Test catalog tools"""
    print("\n=== Testing Catalog Tools ===")
    try:
        # Search for products
        products = await search_products_mongodb("shirt", max_results=3)
        print(f"✅ Product search works - found {len(products)} products")

        if products:
            print(f"   Sample: {products[0].get('title', 'N/A')}")

        return True
    except Exception as e:
        print(f"❌ Catalog tools failed: {e}")
        return False

async def test_event_bus():
    """Test event bus"""
    print("\n=== Testing Event Bus ===")
    try:
        # Test publishing an event
        event_bus.publish(EventType.AGENT_QUERY, {
            "query": "test query",
            "user_id": "test_user"
        })
        print(f"✅ Event bus publish works")

        # Test subscribing
        def test_handler(data):
            print(f"   Handler received: {data.get('query', 'N/A')}")

        event_bus.subscribe(EventType.AGENT_QUERY, test_handler)
        print(f"✅ Event bus subscribe works")

        return True
    except Exception as e:
        print(f"❌ Event bus failed: {e}")
        return False

async def test_exceptions():
    """Test custom exceptions"""
    print("\n=== Testing Custom Exceptions ===")
    try:
        # Test that exceptions can be raised
        try:
            raise PricingConflictError("Test pricing conflict")
        except EcommerceAgentError as e:
            print(f"✅ PricingConflictError caught correctly")

        try:
            raise NodeJSAPIError(404, "Not found")
        except EcommerceAgentError as e:
            print(f"✅ NodeJSAPIError caught correctly: {e}")

        return True
    except Exception as e:
        print(f"❌ Exception testing failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("=" * 60)
    print("Phase 2 Setup Verification")
    print("=" * 60)

    results = []

    # Run tests
    await test_configuration()
    results.append(("MongoDB Connection", await test_mongodb_connection()))
    results.append(("Catalog Tools", await test_catalog_tools()))
    results.append(("Event Bus", await test_event_bus()))
    results.append(("Custom Exceptions", await test_exceptions()))

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 Phase 2 Setup Complete! Ready for Phase 3 (Agent Implementation)")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())
