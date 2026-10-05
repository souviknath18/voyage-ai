from typing import Literal

from pydantic import BaseModel, Field


TripAssistantIntent = Literal[
  "question",
  "change_request",
]

TripChangeScope = Literal[
  "trip",
  "day",
  "activity",
]

TripChangeCategory = Literal[
  "budget",
  "food",
  "transport",
  "activity",
  "schedule",
  "general",
]


class TripAssistantIntentResult(BaseModel):
  intent: TripAssistantIntent


class TripChangeProposal(BaseModel):
  title: str = Field(
    min_length=1,
    max_length=120,
  )

  summary: str = Field(
    min_length=1,
    max_length=500,
  )

  scope: TripChangeScope

  day_number: int | None = Field(
    default=None,
    ge=1,
  )

  category: TripChangeCategory

  instructions: str = Field(
    min_length=1,
    max_length=1000,
  )


class TripAssistantRequest(BaseModel):
  message: str = Field(
    min_length=1,
    max_length=2000,
  )

  active_proposal: TripChangeProposal | None = None


class TripAssistantResponse(BaseModel):
  message: str

  action: Literal[
    "answer",
    "change_requested",
  ]

  proposal: TripChangeProposal | None = None


class TripAssistantApplyRequest(BaseModel):
  proposal: TripChangeProposal