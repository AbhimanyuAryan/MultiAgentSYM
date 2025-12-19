import redis
import json
import asyncio
from typing import Callable, Dict, Any, Optional
from datetime import datetime
from config.settings import settings
from agents.events.event_types import EventType

class EventBus:
    """Redis Streams-based event bus for agent coordination"""

    def __init__(self, redis_url: str = None):
        self.redis_url = redis_url or settings.redis_url
        self.redis = redis.from_url(self.redis_url, decode_responses=True)
        self.handlers: Dict[str, list] = {}
        self._running = False

    def publish(self, event_type: str, data: dict):
        """Publish event to Redis Stream"""
        event_data = {
            "type": event_type,
            "data": json.dumps(data),
            "timestamp": datetime.utcnow().isoformat()
        }
        stream_name = f"events:{event_type}"
        self.redis.xadd(stream_name, event_data)
        print(f"📤 Published event: {event_type}")

    def subscribe(self, event_type: str, handler: Callable):
        """Subscribe to event type"""
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
        print(f"📥 Subscribed to event: {event_type}")

    async def start_consuming(self):
        """Start consuming events (blocking)"""
        self._running = True
        print("🚀 Event bus started consuming...")

        # Create consumer group for each event type
        for event_type in self.handlers.keys():
            stream_name = f"events:{event_type}"
            try:
                self.redis.xgroup_create(stream_name, "agents", id="0", mkstream=True)
            except redis.exceptions.ResponseError:
                # Group already exists
                pass

        # Start consuming from each stream
        streams = {f"events:{et}": ">" for et in self.handlers.keys()}

        while self._running:
            try:
                # Read from multiple streams
                events = self.redis.xreadgroup(
                    groupname="agents",
                    consumername="agent-consumer",
                    streams=streams,
                    count=10,
                    block=1000  # Block for 1 second
                )

                if events:
                    for stream_name, messages in events:
                        event_type = stream_name.decode() if isinstance(stream_name, bytes) else stream_name
                        event_type = event_type.replace("events:", "")

                        for message_id, message_data in messages:
                            await self._handle_event(event_type, message_data, message_id)

                await asyncio.sleep(0.1)  # Small delay to prevent tight loop

            except Exception as e:
                print(f"❌ Error consuming events: {e}")
                await asyncio.sleep(1)

    async def _handle_event(self, event_type: str, message_data: Dict, message_id: str):
        """Handle a single event"""
        try:
            data = json.loads(message_data.get("data", "{}"))
            handlers = self.handlers.get(event_type, [])

            for handler in handlers:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(data)
                    else:
                        handler(data)
                except Exception as e:
                    print(f"❌ Error in handler for {event_type}: {e}")

            # Acknowledge the message
            stream_name = f"events:{event_type}"
            self.redis.xack(stream_name, "agents", message_id)

        except Exception as e:
            print(f"❌ Error handling event {event_type}: {e}")

    def stop(self):
        """Stop consuming events"""
        self._running = False
        print("🛑 Event bus stopped")

    def close(self):
        """Close Redis connection"""
        self.redis.close()

# Global event bus instance
event_bus = EventBus()
