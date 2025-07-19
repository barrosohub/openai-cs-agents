# Copilot Instructions for OpenAI Customer Service Agents Demo

## Architecture Overview

This is a **multi-agent customer service demo** built on the OpenAI Agents SDK with a FastAPI backend and Next.js frontend. The system orchestrates 5 specialized airline agents that hand off conversations between each other:

- **Triage Agent**: Routes initial requests to appropriate specialists
- **FAQ Agent**: Handles general airline information queries
- **Seat Booking Agent**: Manages seat changes with interactive seat maps
- **Flight Status Agent**: Provides flight information and status updates
- **Cancellation Agent**: Processes flight cancellation requests

## Key Development Patterns

### Agent Definition Pattern (`python-backend/main.py`)
Agents are defined using the OpenAI Agents SDK with specific context types:
```python
agent = Agent[AirlineAgentContext](
    name="agent_name",
    instructions="...",
    tools=[function_tool_1, function_tool_2],
    handoffs=[handoff(agent=other_agent)],
    input_guardrails=[guardrail_function]
)
```

### Conversation State Management
- **Backend**: In-memory storage using `conversation_states` dict keyed by UUID
- **Context Object**: `AirlineAgentContext` maintains passenger details across agent handoffs
- **State Persistence**: No database - relies on conversation IDs for session management

### Frontend-Backend Integration Patterns

#### Special UI Triggers
The backend sends magic string `"DISPLAY_SEAT_MAP"` to trigger interactive seat selection:
```python
# Backend pattern for triggering UI components
return MessageOutputItem(content="DISPLAY_SEAT_MAP")
```
```tsx
// Frontend pattern for detecting triggers
const hasTrigger = messages.some(m => m.content === "DISPLAY_SEAT_MAP");
```

#### Event Streaming Architecture
Frontend polls `/events/{conversation_id}` for real-time updates on:
- Agent handoffs between specialists
- Tool call executions (seat changes, flight lookups)
- Guardrail security check results
- Context updates (passenger details)

## Development Workflows

### Backend Development
```bash
cd python-backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn api:app --reload --port 8000
```

### Frontend Development
```bash
cd ui
npm install
npm run dev          # Runs both frontend and backend
npm run dev:next     # Frontend only
```

### Docker Development
```bash
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## Environment Configuration

- **Required**: `OPENAI_API_KEY` in `.env.backend` file or environment
- **CORS**: Backend configured for `http://localhost:3000`
- **Ports**: Backend 8000, Frontend 3000

## Project-Specific Conventions

### Agent Handoff Pattern
All specialized agents can hand back to triage agent for re-routing:
```python
# In main.py - bidirectional handoffs
faq_agent.handoffs.append(triage_agent)
seat_booking_agent.handoffs.append(triage_agent)
```

### Guardrail Integration
Input validation happens at agent level with real-time frontend display:
```python
@input_guardrail(name="relevance_check")
def relevance_guardrail(context: RunContextWrapper[AirlineAgentContext]) -> GuardrailFunctionOutput:
    # Security validation logic
```

### Tool Call Pattern
Custom tools follow specific naming and description patterns:
```python
@function_tool(name_override="tool_name", description_override="Description")
def tool_function(context: RunContextWrapper[AirlineAgentContext], param: str) -> str:
    # Tool implementation
```

## Key Files for Understanding

- `python-backend/main.py`: Agent definitions, tools, guardrails, handoff logic
- `python-backend/api.py`: FastAPI endpoints, conversation state management, CORS
- `ui/components/Chat.tsx`: Main chat interface with seat map integration
- `ui/lib/types.ts`: Shared TypeScript interfaces for messages, agents, events
- `docker-compose.yml`: Full-stack deployment configuration

## Testing Approach

No automated tests - relies on demo flows in README.md for manual testing of agent routing, handoffs, and guardrail functionality. Use the provided demo scenarios to validate changes.
