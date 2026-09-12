import * as vscode from 'vscode';

interface GhostPilotPrediction {
  intent: string;
  confidence: number;
  supporting_signals: string[];
  active_suggestion?: {
    id: string;
    rootCause: string;
    suggestedFix: string;
    originalCode: string;
    targetFile: string;
    targetLine: number;
  };
}

let statusBarItem: vscode.StatusBarItem;
let lastPrediction: GhostPilotPrediction | null = null;
let pauseTimer: NodeJS.Timeout | null = null;
let lastKeypressTime = Date.now();
let backspaceCounter = 0;

export function activate(context: vscode.ExtensionContext) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'ghostpilot.showPrediction';
  statusBarItem.text = '$(pulse) GhostPilot: Ready';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('ghostpilot.analyzeCurrentContext', async () => {
      await collectAndSyncContext();
      vscode.window.showInformationMessage('GhostPilot context analyzed & synced.');
    }),

    vscode.commands.registerCommand('ghostpilot.showPrediction', async () => {
      if (!lastPrediction) {
        await collectAndSyncContext();
      }
      if (lastPrediction) {
        const confPercent = Math.round(lastPrediction.confidence * 100);
        const action = await vscode.window.showInformationMessage(
          `GhostPilot Intent: ${lastPrediction.intent} (${confPercent}%)\nSignals: ${lastPrediction.supporting_signals.join(', ')}`,
          'View Suggestion',
          'Dismiss'
        );
        if (action === 'View Suggestion' && lastPrediction.active_suggestion) {
          vscode.commands.executeCommand('ghostpilot.applySuggestedFix');
        }
      } else {
        vscode.window.showInformationMessage('GhostPilot: No active prediction yet.');
      }
    }),

    vscode.commands.registerCommand('ghostpilot.generateFix', async () => {
      await triggerPrediction(true);
    }),

    vscode.commands.registerCommand('ghostpilot.applySuggestedFix', async () => {
      if (!lastPrediction?.active_suggestion) {
        vscode.window.showWarningMessage('GhostPilot: No prepared fix available.');
        return;
      }
      const sug = lastPrediction.active_suggestion;
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const confirm = await vscode.window.showQuickPick(['Apply Fix', 'Cancel'], {
        placeHolder: `Apply speculative fix for: ${sug.rootCause}`
      });

      if (confirm === 'Apply Fix') {
        await editor.edit(editBuilder => {
          const document = editor.document;
          const line = Math.max(0, sug.targetLine - 1);
          const lineRange = document.lineAt(line).range;
          editBuilder.replace(lineRange, sug.suggestedFix);
        });
        vscode.window.showInformationMessage('GhostPilot: Speculative fix applied.');
        statusBarItem.text = '$(check) GhostPilot: Fix Applied';
      }
    }),

    vscode.commands.registerCommand('ghostpilot.dismissSuggestion', () => {
      lastPrediction = null;
      statusBarItem.text = '$(pulse) GhostPilot: Ready';
      vscode.window.showInformationMessage('GhostPilot suggestion dismissed.');
    })
  );

  // Monitor text changes and typing cadence
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      const now = Date.now();
      const delta = (now - lastKeypressTime) / 1000;
      lastKeypressTime = now;

      // Count backspaces
      for (const change of event.contentChanges) {
        if (change.text === '' && change.rangeLength > 0) {
          backspaceCounter++;
        }
      }

      if (pauseTimer) {
        clearTimeout(pauseTimer);
      }

      // If paused for more than 3 seconds, trigger intent check
      pauseTimer = setTimeout(() => {
        triggerPrediction(false);
      }, 3000);
    })
  );

  // Monitor cursor movement
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(event => {
      if (pauseTimer) {
        clearTimeout(pauseTimer);
      }
      pauseTimer = setTimeout(() => {
        triggerPrediction(false);
      }, 3500);
    })
  );
}

async function collectAndSyncContext() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const document = editor.document;
  const position = editor.selection.active;
  const diagnostics = vscode.languages.getDiagnostics(document.uri);

  const payload = {
    context: {
      project_name: vscode.workspace.name || 'Workspace',
      active_file: vscode.workspace.asRelativePath(document.uri),
      language: document.languageId,
      cursor_line: position.line + 1,
      cursor_column: position.character + 1,
      code_complexity: 2.5,
      diagnostic_count: diagnostics.length,
      source_code: document.getText(),
      selected_text: document.getText(editor.selection) || undefined
    },
    signals: {
      typing_speed: 35.0,
      pause_duration: 3.5,
      backspace_count: backspaceCounter,
      cursor_movement: 1.5,
      mouse_activity: 1.0,
      error_count: diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length,
      terminal_activity: 0.0,
      diagnostic_count: diagnostics.length,
      code_complexity: 2.5,
      time_on_problem: 30.0
    },
    diagnostics: diagnostics.map((d, i) => ({
      id: `diag_${i}`,
      type: 'TypeScriptDiagnostic',
      message: d.message,
      file: vscode.workspace.asRelativePath(document.uri),
      line: d.range.start.line + 1,
      column: d.range.start.character + 1,
      severity: d.severity === vscode.DiagnosticSeverity.Error ? 'error' : 'warning'
    }))
  };

  const config = vscode.workspace.getConfiguration('ghostpilot');
  const serverUrl = config.get<string>('serverUrl', 'http://localhost:3000');

  try {
    await fetch(`${serverUrl}/api/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Local server might be connecting
  }

  return payload;
}

async function triggerPrediction(force: boolean) {
  const config = vscode.workspace.getConfiguration('ghostpilot');
  const serverUrl = config.get<string>('serverUrl', 'http://localhost:3000');

  await collectAndSyncContext();

  try {
    const res = await fetch(`${serverUrl}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = (await res.json()) as GhostPilotPrediction;
      lastPrediction = data;
      const conf = Math.round(data.confidence * 100);
      statusBarItem.text = `$(lightbulb) GhostPilot: ${data.intent} (${conf}%)`;
      statusBarItem.tooltip = `Supporting: ${data.supporting_signals.join(', ')}`;

      if (data.confidence > 0.85 && data.active_suggestion && !force) {
        vscode.window.showInformationMessage(
          `GhostPilot predicted [${data.intent}] (${conf}%). Speculative fix ready.`,
          'Review Diff'
        ).then(choice => {
          if (choice === 'Review Diff') {
            vscode.commands.executeCommand('ghostpilot.applySuggestedFix');
          }
        });
      }
    }
  } catch (e) {
    statusBarItem.text = '$(circle-slash) GhostPilot: Offline';
  }
}

export function deactivate() {
  if (pauseTimer) {
    clearTimeout(pauseTimer);
  }
}
