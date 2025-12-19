from enum import Enum

class EventType(str, Enum):
    # Cart events
    CART_ITEM_ADDED = "cart.item.added"
    CART_UPDATED = "cart.updated"
    CART_ABANDONED = "cart.abandoned"

    # User events
    USER_REGISTERED = "user.registered"
    USER_LOGIN = "user.login"

    # Product events
    PRODUCT_VIEWED = "product.viewed"
    PRODUCT_SEARCHED = "product.searched"

    # Checkout events
    CHECKOUT_STARTED = "checkout.started"
    PAYMENT_COMPLETED = "payment.completed"

    # Agent events
    AGENT_QUERY = "agent.query"
    RECOMMENDATION_REQUESTED = "recommendation.requested"

    # Pricing events
    PRICE_CHANGED = "price.changed"
    PROMOTION_CREATED = "promotion.created"
    PROMOTION_EXPIRED = "promotion.expired"
