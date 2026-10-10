import json
import logging

from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)

redis_client = Redis.from_url(
  settings.redis_url,
  decode_responses=True,
  socket_connect_timeout=1,
  socket_timeout=1,
)


async def cache_get(key: str):
  try:
    value = await redis_client.get(key)

    if value is None:
      logger.info("[Cache] MISS %s", key)
      return None

    logger.info("[Cache] HIT %s", key)
    return json.loads(value)

  except (RedisError, ValueError, TypeError):
    logger.warning(
      "[Cache] Read failed",
      exc_info=True,
    )
    return None


async def cache_set(
  key: str,
  value,
  ttl_seconds: int,
):
  try:
    await redis_client.set(
      key,
      json.dumps(value),
      ex=ttl_seconds,
    )
  except (RedisError, TypeError, ValueError):
    logger.warning(
      "[Cache] Write failed",
      exc_info=True,
    )


async def cache_delete(key: str):
  try:
    await redis_client.delete(key)
  except RedisError:
    logger.warning(
      "[Cache] Delete failed",
      exc_info=True,
    )