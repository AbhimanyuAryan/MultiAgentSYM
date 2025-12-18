# Multi-Agent E-Commerce Retail Platform - Implementation Plan

> **Plan Location**: This plan is saved at `C:\Users\abhimanyu.aryan\.claude\plans\crispy-noodling-mountain.md`
> **Project Directory**: `D:\MIND\MultiAgentSYM`
> **Note**: During implementation, this plan will be copied to `D:\MIND\MultiAgentSYM\IMPLEMENTATION_PLAN.md` for easy reference

## Project Overview
Building an agentic e-commerce platform with specialized agents for:
- **Customer Service**: Handle customer queries, product recommendations, support
- **Pricing & Promotions**: Dynamic pricing strategies, discount campaigns, promotional offers

**Tech Stack**: Python 3.12+ with Agentica framework, uv package manager

## Requirements Analysis

### Customer Service Agent Capabilities
- Answer product inquiries
- Provide personalized recommendations based on customer history
- Handle complaints and issues
- Guide customers through purchase process

### Pricing & Promotions Agent Capabilities
- Analyze market conditions for dynamic pricing
- Create and manage promotional campaigns
- Calculate optimal discounts
- Coordinate flash sales and limited-time offers

### Agent Coordination Needs
- Customer Service agent should be aware of active promotions
- Pricing agent should consider customer service feedback
- Shared access to product catalog and inventory data

## Architecture Design

### Multi-Agent Hierarchy

```
            Platform Orchestrator (Coordinator)
                      |
        ┌─────────────┴──────────────┐
        |                            |
  Customer Service Agent    Pricing & Promotions Agent
        |                            |
  ┌─────┴─────┐              ┌──────┴────────┐
  |           |              |               |
Product     Order      Price           Campaign
Recommender Manager  Optimizer         Manager
(sub-agent) (sub-agent) (sub-agent)    (sub-agent)
```

**Pattern**: Hierarchical Orchestrator with peer-to-peer communication
- **Platform Orchestrator**: Routes requests, coordinates complex workflows (checkout, returns)
- **Main Agents**: Autonomous for simple tasks, coordinated for complex workflows
- **Sub-Agents**: Specialized, fast models for focused tasks

### Project Structure

```
D:\MIND\MultiAgentSYM\
├── config/
│   ├── settings.py              # Environment config (API keys, DB URLs)
│   └── mcp_servers.json         # Optional MCP server config
│
├── core/
│   ├── models.py                # Data models (Customer, Product, Order, Promotion)
│   ├── database.py              # Database connection pooling
│   └── exceptions.py            # Custom exceptions
│
├── tools/
│   ├── database_tools.py        # Shared DB queries (get_customer, get_product)
│   ├── catalog_tools.py         # Product search and catalog operations
│   ├── customer_tools.py        # Customer profile and history
│   ├── pricing_tools.py         # Price calculations and market data
│   └── order_tools.py           # Order management operations
│
├── agents/
│   ├── orchestrator.py          # Platform Orchestrator Agent
│   ├── customer_service/
│   │   ├── agent.py             # CustomerServiceAgent class
│   │   ├── tools.py             # CS-specific tools (recommendations, returns)
│   │   └── sub_agents.py        # ProductRecommendationAgent, OrderManagementAgent
│   └── pricing/
│       ├── agent.py             # PricingPromotionsAgent class
│       ├── tools.py             # Pricing-specific tools (optimize, forecast)
│       └── sub_agents.py        # PriceOptimizerAgent, CampaignManagerAgent
│
├── services/
│   ├── cache_service.py         # Redis caching for shared state
│   └── auth_service.py          # Authentication/authorization
│
├── api/
│   └── main.py                  # FastAPI application (optional)
│
├── tests/
│   ├── test_agents/
│   └── test_integration/
│
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables
└── main.py                      # Entry point / demo script
```

## Implementation Plan

### Phase 1: Project Setup (Foundation)

**Files to create:**

1. **requirements.txt**
   ```
   symbolica-agentica
   pydantic
   pydantic-settings
   python-dotenv
   sqlalchemy
   redis  # optional, for caching
   fastapi  # optional, for API
   uvicorn  # optional, for API
   pytest
   pytest-asyncio
   ```

2. **.env**
   ```
   AGENTICA_API_KEY=your-key-here
   DATABASE_URL=sqlite:///./ecommerce.db
   REDIS_URL=redis://localhost:6379  # optional
   ```

3. **config/settings.py** - Environment configuration using Pydantic
   - Load API keys, database URLs
   - Agent model selection (default: anthropic:claude-sonnet-4.5)
   - Token limits and caching config

### Phase 2: Core Data Layer

**Files to create:**

4. **core/models.py** - Data models
   ```python
   @dataclass classes:
   - Customer (id, name, email, tier, total_spent, preferences)
   - Product (id, name, category, base_price, current_price, inventory)
   - Order (id, customer_id, items, total_amount, status)
   - Promotion (id, name, discount_type, value, start/end dates)
   - MarketData (date, product_id, competitor_prices, demand_score)
   ```

5. **core/database.py** - Database connection manager
   - SQLAlchemy connection pooling
   - Session management
   - Mock data loading for demo

6. **core/exceptions.py** - Custom exceptions
   ```python
   - PricingConflictError
   - InventoryUnavailableError
   - InvalidPromotionError
   - CustomerNotFoundError
   ```

### Phase 3: Shared Tools

**Files to create:**

7. **tools/database_tools.py** - Core database operations
   ```python
   - get_customer_by_id(customer_id: str) -> Customer
   - get_product_by_id(product_id: str) -> Product
   - search_products(query, category, price_range) -> List[Product]
   - get_customer_orders(customer_id: str) -> List[Order]
   ```

8. **tools/customer_tools.py** - Customer operations
   ```python
   - get_customer_profile(customer_id) -> dict
   - get_customer_history(customer_id) -> dict
   - update_customer_preferences(customer_id, preferences)
   ```

9. **tools/pricing_tools.py** - Pricing operations
   ```python
   - get_pricing_history(product_id, days) -> List[dict]
   - get_market_data(product_id) -> MarketData
   - calculate_dynamic_price(product_id, demand, inventory) -> float
   - calculate_discount(products, customer_tier, promotions) -> dict
   ```

10. **tools/catalog_tools.py** - Product catalog
    ```python
    - search_products_by_category(category) -> List[Product]
    - get_similar_products(product_id) -> List[Product]
    - get_product_recommendations(customer_id, context) -> List[Product]
    ```

### Phase 4: Agent Implementation

**Critical files (implement in order):**

11. **agents/pricing/agent.py** - PricingPromotionsAgent
    ```python
    class PricingPromotionsAgent:
        def __init__(self, database_config):
            self._brain = Agent(
                premise="You are a Pricing & Promotions Agent...",
                scope={pricing_tools, market_data, ...},
                model="anthropic:claude-sonnet-4.5"
            )

        async def optimize_price(product_id) -> dict
        async def calculate_cart_pricing(product_ids, customer_tier) -> dict
        async def create_promotion(campaign_details) -> dict
    ```

12. **agents/pricing/sub_agents.py** - Pricing sub-agents
    ```python
    class PriceOptimizerAgent:
        # Specialized for price optimization
        model="openai:gpt-4.1"  # Faster model

    class CampaignManagerAgent:
        # Specialized for campaign management
    ```

13. **agents/customer_service/agent.py** - CustomerServiceAgent
    ```python
    class CustomerServiceAgent:
        def __init__(self, database_config, pricing_agent):
            self._brain = Agent(
                premise="You are a Customer Service Agent...",
                scope={customer_tools, catalog_tools, pricing_agent},
                model="anthropic:claude-sonnet-4.5",
                persist=True  # Maintain conversation history
            )

        async def handle_customer_query(customer_id, query) -> str
        async def get_recommendations(customer_id, context) -> List[dict]
        async def get_customer_context(customer_id) -> dict
    ```

14. **agents/customer_service/sub_agents.py** - CS sub-agents
    ```python
    class ProductRecommendationAgent:
        # Specialized for recommendations

    class OrderManagementAgent:
        # Specialized for order handling
    ```

15. **agents/orchestrator.py** - PlatformOrchestrator (Coordinator)
    ```python
    class PlatformOrchestrator:
        def __init__(self, customer_service_agent, pricing_agent):
            self._brain = Agent(
                premise="You coordinate between agents...",
                scope={
                    "customer_service": customer_service_agent,
                    "pricing_agent": pricing_agent
                }
            )

        async def handle_request(request, context) -> str
        async def process_checkout(customer_id, product_ids) -> dict
    ```

16. **agents/__init__.py** - Agent initialization
    ```python
    async def initialize_platform(database_config) -> PlatformOrchestrator:
        # Create agents with proper dependency injection
        pricing_agent = PricingPromotionsAgent(database_config)
        customer_service = CustomerServiceAgent(database_config, pricing_agent)
        orchestrator = PlatformOrchestrator(customer_service, pricing_agent)
        return orchestrator
    ```

### Phase 5: Demo Application

17. **main.py** - Entry point with example interactions
    ```python
    async def main():
        # Initialize platform
        orchestrator = await initialize_platform(db_config)

        # Example 1: Customer inquiry
        response = await orchestrator.customer_service.handle_customer_query(
            customer_id="cust_123",
            query="Show me running shoes under $100"
        )

        # Example 2: Price optimization
        result = await orchestrator.pricing_agent.optimize_price("prod_456")

        # Example 3: Complex checkout
        checkout = await orchestrator.process_checkout(
            customer_id="cust_123",
            product_ids=["prod_1", "prod_2"]
        )
    ```

### Phase 6: Testing (Optional but Recommended)

18. **tests/test_agents/test_customer_service.py** - Unit tests
19. **tests/test_integration/test_checkout_flow.py** - Integration tests

## Key Design Decisions

### Agent Communication
- **Primary**: Hierarchical through orchestrator for complex workflows
- **Secondary**: Peer-to-peer (CS Agent → Pricing Agent) for real-time pricing
- **Future**: Event-driven notifications for price changes

### Model Selection
- **Main Agents**: `anthropic:claude-sonnet-4.5` for quality and reasoning
- **Sub-Agents**: `openai:gpt-4.1` for speed and cost efficiency
- **Configurable**: All models can be changed in settings.py

### Persistence
- **Customer Service Agent**: `persist=True` for conversation history
- **Pricing Agent**: Stateless, recalculates on each request
- **Cache**: Redis for shared state (prices, promotions) with 5-min TTL

### Error Handling
- Custom exceptions for domain errors (PricingConflictError, etc.)
- Retry logic for RateLimitError
- Graceful fallbacks with user-friendly messages
- Comprehensive logging via Agentica's built-in logging

### Scope Management
- **Shared tools**: Database access, product catalog
- **Agent-specific tools**: Recommendations (CS), Price optimization (Pricing)
- **Peer references**: CS Agent has Pricing Agent in scope for direct queries

## Critical Files Summary

**Must implement (in order):**
1. `requirements.txt` + `.env` - Dependencies and config
2. `core/models.py` - Data models
3. `tools/database_tools.py` - Shared database operations
4. `tools/pricing_tools.py` - Pricing calculations
5. `tools/customer_tools.py` - Customer operations
6. `agents/pricing/agent.py` - Pricing Agent
7. `agents/customer_service/agent.py` - Customer Service Agent
8. `agents/orchestrator.py` - Platform Orchestrator
9. `agents/__init__.py` - Agent initialization
10. `main.py` - Demo application

**Total core files**: ~15 Python files for MVP
**Estimated LOC**: ~2,000-2,500 lines total

## Next Steps After Implementation

1. **Load Sample Data**: Create mock customers, products, orders
2. **Test Basic Flows**: Customer inquiry → Product recommendation → Pricing
3. **Test Complex Flows**: Checkout with multiple promotions
4. **Monitor Token Usage**: Track costs via `agent.total_usage()`
5. **Optimize**: Add caching, adjust model selection for sub-agents
6. **API (Optional)**: Add FastAPI endpoints for web integration

## Example Interaction Flows

### Flow 1: Customer Product Inquiry
```
User: "I'm looking for running shoes under $100"
↓
Orchestrator → Customer Service Agent
↓
CS Agent: search_products("running shoes")
CS Agent → Pricing Agent: "Get current prices and promotions"
↓
Pricing Agent: Returns prices + active promotions
↓
CS Agent: Filters under $100, generates recommendations
↓
Response: "Here are 3 running shoes under $100: [list with prices]"
```

### Flow 2: Checkout Process
```
User: Checkout with cart
↓
Orchestrator coordinates:
  - CS Agent: Validate customer + inventory
  - Pricing Agent: Calculate pricing + promotions + discounts
↓
Orchestrator: Creates order with final pricing
↓
Response: Order confirmation with total
```

### Flow 3: Price Optimization (Admin)
```
Admin: "Optimize pricing for Product X"
↓
Orchestrator → Pricing Agent
↓
Pricing Agent:
  - get_market_data(product_x)
  - predict_demand(product_x)
  - calculate_dynamic_price(...)
↓
Price Optimizer Sub-Agent: Analyzes and recommends price
↓
Response: New price + reasoning + expected impact
```

---

**Ready to implement!** This architecture provides a solid foundation for an agentic e-commerce platform with clear separation of concerns, flexible coordination, and room for future enhancements.
