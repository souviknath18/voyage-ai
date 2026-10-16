"""
Association tables for Explore destination models.
"""

from sqlalchemy import Column, ForeignKey, Table

from app.db.base import Base


explore_destination_categories = Table(
    "explore_destination_categories",
    Base.metadata,
    Column(
        "destination_id",
        ForeignKey(
            "explore_destinations.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),
    Column(
        "category_id",
        ForeignKey(
            "explore_categories.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),
)