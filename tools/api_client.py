import httpx
from typing import Optional, Dict, Any, List
from config.settings import settings
from core.exceptions import NodeJSAPIError

class NodeJSClient:
    """HTTP client to call your Node.js Express API"""

    def __init__(self, base_url: str = None):
        self.base_url = base_url or settings.nodejs_api_url
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def _handle_response(self, response: httpx.Response) -> Any:
        """Handle API response and raise errors if needed"""
        if response.status_code >= 400:
            raise NodeJSAPIError(
                status_code=response.status_code,
                message=response.text
            )
        return response.json()

    async def search_products(self, query: str) -> List[Dict]:
        """Call GET /search?query=..."""
        response = await self.client.get("/search", params={"query": query})
        data = await self._handle_response(response)
        return data.get("products", [])

    async def get_products(self, **filters) -> List[Dict]:
        """Call GET /products with filters"""
        response = await self.client.get("/products", params=filters)
        data = await self._handle_response(response)
        return data.get("products", [])

    async def get_product(self, product_id: str) -> Dict:
        """Call GET /products/:id"""
        response = await self.client.get(f"/products/{product_id}")
        data = await self._handle_response(response)
        return data.get("product", {})

    async def get_cart(self, user_id: str, token: str) -> Dict:
        """Call GET /users/:userId/cart"""
        headers = {"authorization": token}
        response = await self.client.get(f"/users/{user_id}/cart", headers=headers)
        data = await self._handle_response(response)
        return data.get("cart", {})

    async def add_to_cart(self, user_id: str, product_id: str, token: str,
                         increase: bool = False, decrease: bool = False) -> Dict:
        """Call POST /users/:userId/cart"""
        headers = {"authorization": token}
        payload = {"productId": product_id}
        if increase:
            payload["increase"] = True
        if decrease:
            payload["decrease"] = True
        response = await self.client.post(f"/users/{user_id}/cart",
                                         json=payload, headers=headers)
        return await self._handle_response(response)

    async def update_cart_variant(self, user_id: str, variant_id: str, token: str) -> Dict:
        """Call PUT /users/:userId/cart to replace with variant"""
        headers = {"authorization": token}
        response = await self.client.put(f"/users/{user_id}/cart",
                                        json={"variantId": variant_id},
                                        headers=headers)
        return await self._handle_response(response)

    async def login(self, email: str, password: str) -> Dict:
        """Call POST /users/login"""
        response = await self.client.post("/users/login",
                                         json={"credential": {"email": email, "password": password}})
        return await self._handle_response(response)

    async def register(self, fullname: str, email: str, password: str) -> Dict:
        """Call POST /users/signin"""
        response = await self.client.post("/users/signin",
                                         json={"fullname": fullname, "email": email,
                                              "password": password, "verifyPassword": password})
        return await self._handle_response(response)

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global API client instance
api_client = NodeJSClient()
