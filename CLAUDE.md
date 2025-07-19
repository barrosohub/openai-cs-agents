# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Customer Service Agents demo built on the OpenAI Agents SDK. It consists of:

1. **Python Backend** (`python-backend/`): FastAPI server implementing multi-agent orchestration with specialized airline customer service agents (Triage, FAQ, Seat Booking, Flight Status, Cancellation)
2. **Next.js Frontend** (`ui/`): React/TypeScript UI providing real-time visualization of agent conversations, handoffs, tool calls, and guardrail checks

## Development Commands

### Backend Development
```bash
# Setup virtual environment and dependencies
cd python-backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Run backend server
python -m uvicorn api:app --reload --port 8000
```

### Frontend Development
```bash
# Install dependencies
cd ui
npm install

# Run frontend only
npm run dev:next

# Run both frontend and backend simultaneously
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Docker Development
```bash
# Run full stack with Docker Compose
docker-compose up --build

# Backend available at: http://localhost:8000
# Frontend available at: http://localhost:3000
```

## Architecture

### Backend Architecture (`python-backend/`)
- **FastAPI API Layer** (`api.py`): Main HTTP endpoints, conversation state management, CORS configuration
- **Agent Orchestration** (`main.py`): Defines 5 specialized agents using OpenAI Agents SDK:
  - `triage_agent`: Routes initial requests to appropriate specialist agents
  - `faq_agent`: Handles general airline information queries
  - `seat_booking_agent`: Manages seat changes and displays interactive seat maps
  - `flight_status_agent`: Provides flight information and status updates
  - `cancellation_agent`: Processes flight cancellation requests
- **Context Management**: `AirlineAgentContext` maintains conversation state (passenger details, confirmation numbers, etc.)
- **Guardrails**: Input validation for relevance and jailbreak prevention
- **Tool Integration**: Custom tools for FAQ lookup, seat management, flight operations

### Frontend Architecture (`ui/`)
- **Main Chat Interface** (`components/Chat.tsx`): Message rendering, seat map integration, markdown support
- **Agent Visualization**: Real-time display of active agents, handoffs, and tool executions
- **Guardrail Monitoring** (`components/guardrails.tsx`): Visual indicators for security check status
- **Type System** (`lib/types.ts`): Shared interfaces for messages, agents, events, and guardrail checks
- **API Integration** (`lib/api.ts`): Backend communication layer

### Key Integration Points
- **Conversation State**: In-memory storage with conversation IDs for session persistence
- **Real-time Events**: WebSocket-like polling for agent events, tool calls, and context updates
- **Special UI Triggers**: Backend sends `DISPLAY_SEAT_MAP` to trigger interactive seat selection
- **Guardrail Integration**: Frontend displays real-time security check results

## Environment Setup

Required environment variables:
- `OPENAI_API_KEY`: Set in `.env.backend` file or environment
- Backend runs on port 8000, frontend on port 3000
- CORS configured for `http://localhost:3000`

## Testing & Validation

The project includes demo flows in README.md for testing agent routing, handoffs, and guardrail functionality. No automated test suite is currently implemented.