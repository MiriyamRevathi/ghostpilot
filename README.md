# GhostPilot - Speculative Intent Prediction & Autonomous Pair Programmer

GhostPilot is an enterprise-grade AI pair programming workspace featuring real-time speculative intent forecasting, speculative execution sandboxing, incremental AST intelligence, and Language Server Protocol integration.

## Key Subsystems

- **Speculative Execution Engine**: Pre-computes and reconciles prospective edits in shadow sandboxes.
- **Developer Intent Classifier**: Real-time typing cadence, cursor kinematics, and contextual attention heatmaps.
- **AST Intelligence**: Tree-Sitter incremental parsing, control flow graph construction, and reachability profiling.
- **Context Orchestration**: Sliding token budget optimizer, hybrid BM25 / vector embeddings code retriever.
- **Multi-Agent Collaboration**: Autonomous hierarchical planner, subagent supervisor, and automated repair bot.
- **Language Server Protocol**: JSON-RPC completion, hover documentation, rename refactoring, and code actions.
- **Collaborative Sync**: CRDT document mesh, multi-cursor presence, and conflict arbitration.

## Installation

### Prerequisites
- Node.js >= 20.0.0
- Python >= 3.11
- Poetry or Pip

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
poetry install
```

## Running the Application

### Development Mode
```bash
# Starts the frontend server and API gateway
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker compose up -d --build
```

## Testing & Quality Assurance
```bash
# Run unit and integration tests
npm test
cd backend && pytest
```
