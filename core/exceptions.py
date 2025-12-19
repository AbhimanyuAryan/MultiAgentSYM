from agentica.errors import AgenticaError

class EcommerceAgentError(AgenticaError):
    """Base exception for e-commerce agent errors"""
    pass

class PricingConflictError(EcommerceAgentError):
    """Raised when pricing rules conflict"""
    pass

class InventoryUnavailableError(EcommerceAgentError):
    """Raised when product is out of stock"""
    pass

class InvalidPromotionError(EcommerceAgentError):
    """Raised when promotion code is invalid"""
    pass

class CustomerNotFoundError(EcommerceAgentError):
    """Raised when customer doesn't exist"""
    pass

class NodeJSAPIError(EcommerceAgentError):
    """Raised when Node.js API call fails"""
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        super().__init__(f"API Error {status_code}: {message}")
