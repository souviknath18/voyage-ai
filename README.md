# VoyageAI — Agentic AI Travel Planner

An AI-powered travel planning platform that transforms a user's travel goals, budget, dates, interests, and preferences into personalized day-by-day itineraries using an Agentic AI workflow.

Built with modern full stack architecture using Next.js, FastAPI, PostgreSQL, LangGraph, OpenAI, SQLAlchemy, Geoapify, Open-Meteo, and cloud deployment.

---

# 🌐 Live Demo

## Frontend

https://voyage-ai-zeta.vercel.app/

## Backend API

https://voyage-ai-xjln.onrender.com/

## API Documentation

https://voyage-ai-xjln.onrender.com/docs

> ⚠️ **Backend Cold Start**
>
> The FastAPI backend is currently hosted on Render's free tier.
> After a period of inactivity, the backend may go to sleep.
>
> The first request can take approximately **50 seconds** while the server wakes up.
> After the backend is active, subsequent requests are significantly faster.

---

# ✨ Overview

VoyageAI helps users plan trips by providing:

* Origin
* Destination
* Travel dates
* Number of travelers
* Budget
* Currency
* Travel interests
* Travel pace
* Personal preferences

The platform automatically:

* Interprets travel requirements
* Creates a structured trip
* Resolves destination information
* Researches relevant places
* Retrieves weather information
* Generates personalized itineraries
* Calculates estimated trip costs
* Validates itinerary constraints
* Re-plans invalid itineraries
* Tracks AI agent execution
* Stores generated trips and itineraries

The project combines:

* Agentic AI
* LLM-powered itinerary generation
* LangGraph workflow orchestration
* Tool calling
* External API integration
* Constraint validation
* Automatic re-planning
* Persistent agent state
* Full stack travel planning

---

# 🧠 Core Features

## 🗺️ Intelligent Trip Planning

Users can create trips using structured travel information including:

* Origin
* Destination
* Start date
* End date
* Travelers
* Budget
* Currency
* Interests
* Travel pace
* Additional travel preferences

VoyageAI converts these inputs into a structured trip planning workflow.

---

## 🤖 Agentic AI Planning

VoyageAI uses an Agentic AI workflow rather than a simple prompt-response chatbot.

The planning agent can:

* Load trip context
* Research trip information
* Generate an itinerary
* Validate the generated plan
* Detect constraint violations
* Re-plan when validation fails
* Finalize a valid itinerary

The current planning graph follows:

```text
START
  │
  ▼
Load Context
  │
  ▼
Research Trip
  │
  ▼
Generate Itinerary
  │
  ▼
Validate Itinerary
  │
  ├──── Valid ───────────────► Complete
  │
  └──── Invalid
          │
          ▼
     Re-plan Itinerary
          │
          ▼
     Validate Again
          │
          ├──── Valid ───────► Complete
          │
          └──── Retry Limit ─► Failed
```

This creates a controlled planning loop instead of relying on a single LLM response.

---

## 🔄 Automatic Re-Planning

Generated itineraries are validated before being finalized.

If the itinerary violates supported constraints, VoyageAI can automatically attempt to generate an improved version.

The workflow includes:

* Validation
* Re-planning
* Retry limits
* Failure handling
* Final itinerary selection

This prevents the AI planning loop from continuing indefinitely.

---

## 📍 Location & Places Research

VoyageAI integrates location and places data into the planning workflow.

The system can research:

* Tourist attractions
* Restaurants
* Cafés
* Parks and nature
* Cultural locations
* Shopping areas
* Nightlife

Place research is grounded using external location data rather than relying entirely on LLM-generated knowledge.

---

## 🌦️ Weather Integration

VoyageAI can retrieve weather information for supported travel dates.

Weather information can include:

* Maximum temperature
* Minimum temperature
* Precipitation probability
* Weather condition
* Destination coordinates
* Forecast availability

The backend also includes retry and failure handling when the weather provider is unavailable.

---

## 🧭 Day-by-Day Itinerary Generation

The AI planning system generates structured travel itineraries containing:

* Daily activities
* Places
* Activity descriptions
* Start times
* Duration
* Estimated costs
* Travel context
* Destination information

Itinerary information is persisted so trips can be revisited later.

---

## 💰 Budget-Aware Planning

VoyageAI includes backend budget and validation logic for travel plans.

The system is designed to:

* Track estimated costs
* Compare plans against the user's budget
* Detect invalid plans
* Re-plan when constraints are violated
* Maintain structured cost information

---

## 📊 Agent Activity Tracking

Agent execution is stored and exposed to the frontend.

Users can view the progress of the planning workflow, including high-level steps such as:

* Researching the trip
* Finding places
* Checking weather
* Generating itinerary
* Validating itinerary
* Re-planning
* Completing the plan

This makes the AI workflow more observable than a traditional chatbot.

---

## 💾 Persistent Trips

VoyageAI stores application data in PostgreSQL.

Persistent entities include concepts such as:

* Users
* Trips
* Trip preferences
* Agent runs
* Agent steps
* Tool calls
* Itineraries
* Itinerary days
* Itinerary items
* Trip places

Database schema changes are managed using Alembic migrations.

---

# 🏗️ System Architecture

## Frontend

Built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* MapLibre GL

Frontend responsibilities:

* Authentication UI
* Trip creation
* Destination selection
* Travel preference collection
* Agent planning progress
* Trip dashboard
* Itinerary visualization
* Places display
* Budget interface
* Agent activity visualization
* Map-based travel UI

---

## Backend

Built with:

* Python
* FastAPI
* SQLAlchemy
* Async SQLAlchemy
* PostgreSQL
* Alembic
* Pydantic

Backend responsibilities:

* REST APIs
* Authentication
* Trip management
* Agent orchestration
* AI integration
* Tool execution
* Place research
* Weather research
* Itinerary generation
* Validation
* Re-planning
* Database persistence

---

## AI Layer

Uses:

* OpenAI
* LangChain
* LangGraph
* Structured AI outputs

Capabilities:

* Travel planning
* Itinerary generation
* Agent state management
* Multi-step workflows
* Tool execution
* Constraint-aware planning
* Automatic re-planning

---

## Agent Orchestration

VoyageAI uses **LangGraph** to model the travel planning process as a stateful workflow.

Core planning nodes include:

```text
load_context
      ↓
research_trip
      ↓
generate_itinerary
      ↓
validate_itinerary
      ↓
replan_itinerary
```

Conditional graph routing determines whether the itinerary should:

* Complete successfully
* Be re-planned
* Fail after the configured retry limit

---

## External Data Layer

VoyageAI integrates external services for grounded travel information.

### Geoapify

Used for:

* Destination/location data
* Places of interest
* Attractions
* Restaurants
* Cultural locations
* Shopping
* Nature
* Nearby place discovery

### Open-Meteo

Used for:

* Weather forecasts
* Temperature information
* Precipitation probability
* Weather conditions

### Unsplash

Used for:

* Destination imagery
* Travel-related images

---

# 🔄 Full Workflow

## Step 1 — Create Trip

User provides:

* Origin
* Destination
* Travel dates
* Travelers
* Budget
* Currency
* Interests
* Preferences

The frontend sends the trip information to the FastAPI backend.

---

## Step 2 — Persist Trip

The backend validates the request and stores:

* Trip information
* User preferences
* Destination data

in PostgreSQL.

---

## Step 3 — Start Agent Run

A persistent agent run is created.

The system records the current planning state and begins the LangGraph workflow.

---

## Step 4 — Research Trip

The agent executes approved travel tools.

Current research capabilities include:

* Destination/location resolution
* Place discovery
* Weather lookup

Tool executions can be persisted for observability and debugging.

---

## Step 5 — Generate Itinerary

Research results and user preferences are provided to the AI planning layer.

The system generates a structured day-by-day itinerary.

---

## Step 6 — Validate Itinerary

VoyageAI validates the generated itinerary against supported constraints.

The validation layer determines whether the itinerary can be finalized or requires another planning attempt.

---

## Step 7 — Re-Plan

If validation fails:

```text
Invalid Itinerary
      ↓
Re-plan
      ↓
Validate
      ↓
Valid?
```

The process continues within a bounded retry limit.

This prevents uncontrolled agent loops.

---

## Step 8 — Persist Final Plan

Once planning succeeds, the application stores:

* Final itinerary
* Itinerary days
* Activities
* Places
* Estimated costs
* Agent execution information

---

## Step 9 — Display Trip

The Next.js frontend presents the generated trip through:

* Trip workspace
* Day-by-day itinerary
* Places
* Map
* Budget
* Agent activity
* Travel information

---

# 🧩 Key Technical Highlights

## ✅ LangGraph Agent Workflow

Implements a stateful planning graph with:

* Multiple planning nodes
* Conditional routing
* Validation
* Re-planning
* Retry limits
* Failure states

---

## ✅ AI + Deterministic Backend Logic

VoyageAI separates AI reasoning from deterministic application logic.

AI is used for:

* Planning
* Itinerary generation
* Travel reasoning

Backend logic handles:

* Validation
* Database operations
* Tool execution
* State transitions
* API communication

This improves reliability compared with relying entirely on LLM-generated output.

---

## ✅ Grounded Travel Research

The system does not rely exclusively on the LLM for travel information.

It integrates external providers for:

* Places
* Locations
* Weather

This provides grounded context for itinerary generation.

---

## ✅ Observable Agent Execution

VoyageAI stores agent execution information such as:

* Agent runs
* Agent steps
* Tool calls
* Execution status
* Tool results
* Failures

This makes the AI workflow easier to debug and explain.

---

## ✅ Async FastAPI Architecture

The backend uses asynchronous Python components including:

* FastAPI
* Async SQLAlchemy
* asyncpg
* HTTPX

This supports efficient database and external API operations.

---

## ✅ Database Migration Management

Alembic is used to manage PostgreSQL schema evolution.

The database architecture supports:

* Users
* Trips
* Preferences
* Agent runs
* Agent steps
* Tool calls
* Itineraries
* Places

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* MapLibre GL

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Alembic
* asyncpg

## AI / Agentic AI

* OpenAI
* LangChain
* LangGraph
* Structured outputs
* Agent state management
* Tool calling

## Database

* PostgreSQL
* Neon

## External APIs

* Geoapify
* Open-Meteo
* Unsplash

## Infrastructure

* Vercel
* Render
* Neon PostgreSQL

---

# 📸 Screens

## Landing Page

* Travel planning introduction
* Featured destinations
* AI travel planner entry point

## Dashboard

* User trips
* Upcoming travel
* Agent activity
* Travel recommendations

## Plan Trip

* Origin and destination
* Travel dates
* Traveler count
* Budget
* Interests
* Travel pace
* AI travel preferences

## Planning Screen

* Agent progress
* Planning status
* Research progress
* High-level AI actions

## Trip Workspace

* Day-by-day itinerary
* Places
* Budget
* Map
* Agent activity
* Trip overview

---

# 🔐 Authentication & Security

* JWT authentication
* Access and refresh tokens
* Protected API endpoints
* User-specific trip isolation
* Password hashing
* Environment-based secrets
* CORS configuration
* Server-side external API keys

Sensitive API keys and database credentials are never intentionally exposed to the frontend.

---

# 🚀 Future Enhancements

Planned features:

* Live flight search
* Live hotel search
* Currency conversion
* More travel data providers
* Advanced route optimization
* Restaurant recommendations
* Collaborative trip planning
* Calendar export
* Email itinerary export
* Flight disruption monitoring
* Price monitoring
* Background job processing
* Redis-based task processing
* More advanced LangGraph workflows
* Personalized travel memory
* Mobile/PWA experience

---

# 📦 Local Setup

## Clone Repository

```bash
git clone https://github.com/souviknath18/voyage-ai.git
cd voyage-ai
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Frontend runs at:

```text
http://localhost:3000
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file based on `.env.example`.

Example:

```env
APP_NAME=VoyageAI
ENVIRONMENT=development

DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/voyageai

JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

GEOAPIFY_API_KEY=your_geoapify_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

Never commit `.env` files or API keys to GitHub.

---

## Database Migration

Run:

```bash
alembic upgrade head
```

---

## Start Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🌐 Deployment

## Frontend

* Vercel
* https://voyage-ai-zeta.vercel.app/

## Backend

* Render
* https://voyage-ai-xjln.onrender.com/

## Database

* Neon PostgreSQL

---

## ⚠️ Render Free Tier Notice

The VoyageAI backend is currently deployed using the **Render free tier**.

Render may spin down the backend service after a period of inactivity.

Because of this, the first request after the backend has been inactive may take approximately:

```text
~50 seconds
```

while the FastAPI service wakes up.

After the service is active, subsequent API requests should respond normally.

If the live demo initially appears to be loading, please allow the backend a short time to start before retrying.

---

# 💡 Why This Project Stands Out

This project demonstrates hands-on experience with:

* Full stack application architecture
* Agentic AI systems
* LangGraph workflows
* LLM integration
* Tool calling
* Stateful AI workflows
* Automatic re-planning
* Constraint validation
* External API integration
* Async FastAPI development
* PostgreSQL data modeling
* SQLAlchemy ORM
* Alembic migrations
* Authentication and authorization
* AI workflow observability
* Cloud deployment
* Production frontend/backend integration

VoyageAI demonstrates more than simply calling an LLM API. It combines AI reasoning with deterministic backend logic, external travel data, persistent state, validation, and controlled re-planning to create a structured Agentic AI application.

---

# ⚠️ Project Scope

VoyageAI currently focuses on:

* Travel research
* AI-assisted planning
* Recommendations
* Itinerary generation
* Budget-aware planning

The current version does **not** directly:

* Purchase flights
* Book hotels
* Process payments
* Make irreversible reservations

Travel information, prices, availability, and recommendations should be verified with the relevant provider before making travel decisions.

---

# 👨‍💻 Author

Souvik Nath

Full Stack Engineer focused on:

* Python / FastAPI / Django
* React / Next.js
* Agentic AI
* LLM-powered applications
* PostgreSQL
* Scalable backend systems

GitHub:  
https://github.com/souviknath18

LinkedIn:  
https://www.linkedin.com/in/stackwithsouvik/
