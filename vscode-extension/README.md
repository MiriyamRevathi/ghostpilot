# GhostPilot VS Code Extension

Zero-Touch Developer Intent Predictor extension for Visual Studio Code.

## Features

- **Context Detection**: Automatically extracts active document path, cursor position, selection, and LSP diagnostics.
- **Signal Monitoring**: Tracks typing cadence, pauses, backspace bursts, and editor focus.
- **Zero-Touch Speculation**: When confidence exceeds threshold (`> 80%`), GhostPilot prepares candidate diffs and unit tests speculatively.
- **Commands**:
  - `GhostPilot: Analyze Current Context`
  - `GhostPilot: Show Prediction`
  - `GhostPilot: Generate Fix`
  - `GhostPilot: Apply Suggested Fix`
  - `GhostPilot: Dismiss Suggestion`

## Installation

```bash
cd vscode-extension
npm install
npm run compile
```

Press `F5` in VS Code to launch the Extension Development Host.
