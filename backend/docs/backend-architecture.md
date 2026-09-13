# VoyageAI Backend Architecture

Target architecture:

voyageai-backend/
│
├── app/
│   │
│   ├── main.py
│   ├── lifespan.py
│   │
│   ├── api/
│   │   ├── router.py
│   │   ├── dependencies.py
│   │   │
│   │   └── v1/
│   │       ├── router.py
│   │       └── health.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   ├── exception_handlers.py
│   │   ├── middleware.py
│   │   ├── constants.py
│   │   └── permissions.py
│   │
│   ├── db/
│   │   ├── client.py
│   │   ├── database.py
│   │   ├── collections.py
│   │   ├── indexes.py
│   │   └── transaction.py
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   ├── dependencies.py
│   │   │   ├── tokens.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── users/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── trips/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   ├── selectors.py
│   │   │   ├── dependencies.py
│   │   │   ├── constants.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── itineraries/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── flights/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── hotels/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── places/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── saved_places/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── budgets/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   ├── calculator.py
│   │   │   └── service.py
│   │   │
│   │   ├── recommendations/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── assistant/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   ├── service.py
│   │   │   └── streaming.py
│   │   │
│   │   ├── agent_activity/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── notifications/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   ├── sharing/
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── documents.py
│   │   │   ├── repository.py
│   │   │   └── service.py
│   │   │
│   │   └── exports/
│   │       ├── router.py
│   │       ├── schemas.py
│   │       ├── service.py
│   │       └── pdf_service.py
│   │
│   ├── ai/
│   │   ├── config.py
│   │   │
│   │   ├── providers/
│   │   │   ├── base.py
│   │   │   ├── openai.py
│   │   │   └── embeddings.py
│   │   │
│   │   ├── agents/
│   │   │   ├── planner.py
│   │   │   ├── flight.py
│   │   │   ├── hotel.py
│   │   │   ├── places.py
│   │   │   ├── budget.py
│   │   │   └── optimizer.py
│   │   │
│   │   ├── workflows/
│   │   │   ├── trip_planning/
│   │   │   │   ├── graph.py
│   │   │   │   ├── state.py
│   │   │   │   ├── nodes.py
│   │   │   │   └── edges.py
│   │   │   │
│   │   │   └── trip_optimization/
│   │   │       ├── graph.py
│   │   │       ├── state.py
│   │   │       ├── nodes.py
│   │   │       └── edges.py
│   │   │
│   │   ├── tools/
│   │   │   ├── flight_search.py
│   │   │   ├── hotel_search.py
│   │   │   ├── place_search.py
│   │   │   ├── weather.py
│   │   │   ├── maps.py
│   │   │   └── budget.py
│   │   │
│   │   ├── prompts/
│   │   │   ├── planner.py
│   │   │   ├── itinerary.py
│   │   │   ├── optimizer.py
│   │   │   └── assistant.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── itinerary.py
│   │   │   ├── recommendation.py
│   │   │   └── tool_results.py
│   │   │
│   │   ├── memory/
│   │   │   ├── conversation.py
│   │   │   └── trip_context.py
│   │   │
│   │   ├── guardrails/
│   │   │   ├── validation.py
│   │   │   └── hallucination.py
│   │   │
│   │   └── exceptions.py
│   │
│   ├── integrations/
│   │   ├── flights/
│   │   │   ├── client.py
│   │   │   ├── schemas.py
│   │   │   └── mapper.py
│   │   │
│   │   ├── hotels/
│   │   │   ├── client.py
│   │   │   ├── schemas.py
│   │   │   └── mapper.py
│   │   │
│   │   ├── maps/
│   │   │   └── client.py
│   │   │
│   │   ├── weather/
│   │   │   └── client.py
│   │   │
│   │   ├── email/
│   │   │   ├── client.py
│   │   │   └── templates/
│   │   │
│   │   └── storage/
│   │       └── client.py
│   │
│   ├── workers/
│   │   ├── worker.py
│   │   ├── tasks/
│   │   │   ├── trip_generation.py
│   │   │   ├── trip_optimization.py
│   │   │   ├── notifications.py
│   │   │   ├── recommendations.py
│   │   │   └── exports.py
│   │   └── schedules.py
│   │
│   ├── events/
│   │   ├── types.py
│   │   ├── publisher.py
│   │   └── handlers/
│   │       ├── trip_events.py
│   │       └── agent_events.py
│   │
│   └── common/
│       ├── pagination.py
│       ├── datetime.py
│       ├── ids.py
│       ├── enums.py
│       └── types.py
│
├── migrations/
│   ├── 001_initial_indexes.py
│   ├── 002_agent_indexes.py
│   └── runner.py
│
├── scripts/
│   ├── create_indexes.py
│   ├── seed_dev_data.py
│   ├── create_admin.py
│   └── rebuild_search_indexes.py
│
├── tests/
│   ├── unit/
│   │   ├── modules/
│   │   ├── ai/
│   │   └── core/
│   │
│   ├── integration/
│   │   ├── api/
│   │   ├── repositories/
│   │   └── integrations/
│   │
│   ├── e2e/
│   │   └── test_trip_planning_flow.py
│   │
│   ├── fixtures/
│   └── conftest.py
│
├── infra/
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── nginx/
│       └── nginx.conf
│
├── docs/
│   ├── architecture.md
│   ├── mongodb-schema.md
│   ├── api.md
│   └── agent-workflows.md
│
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
│
├── .env
├── .env.example
├── .gitignore
├── pyproject.toml
├── uv.lock
├── README.md
└── Makefile