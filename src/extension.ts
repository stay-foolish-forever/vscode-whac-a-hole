import * as vscode from 'vscode';

let whackTimeout: NodeJS.Timeout | undefined;
let whackCount = 0;

// Normal mole emoji and whacked mole emoji
const MOLE_NORMAL = '🐹';
const MOLE_WHACKED = '🔨💥';

export function activate(context: vscode.ExtensionContext) {
  // Create status bar item on the right side
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.name = 'Whac-A-Hole';
  statusBarItem.text = MOLE_NORMAL;
  statusBarItem.tooltip = 'Whac-A-Hole: 每次敲击键盘都会锤到地鼠！';
  statusBarItem.command = 'whac-a-hole-vscode.showStats';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  // Register command to show stats
  const showStatsCommand = vscode.commands.registerCommand(
    'whac-a-hole-vscode.showStats',
    () => {
      vscode.window.showInformationMessage(
        `Whac-A-Hole: 你已经锤了地鼠 ${whackCount} 次！🔨`
      );
    }
  );
  context.subscriptions.push(showStatsCommand);

  // Listen to text change events (keystrokes in editor)
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    (e: vscode.TextDocumentChangeEvent) => {
      // Only react to content changes (actual keystrokes)
      if (e.contentChanges.length === 0) {
        return;
      }

      whackCount++;
      whackTheMole(statusBarItem);
    }
  );

  context.subscriptions.push(onDidChangeTextDocument);

  // Also listen to selection changes from keyboard
  const onDidChangeSelection = vscode.window.onDidChangeTextEditorSelection(
    (e: vscode.TextEditorSelectionChangeEvent) => {
      // Selection changes from keyboard also count as whacks
      if (e.kind === vscode.TextEditorSelectionChangeKind.Keyboard) {
        whackCount++;
        whackTheMole(statusBarItem);
      }
    }
  );

  context.subscriptions.push(onDidChangeSelection);
}

function whackTheMole(statusBarItem: vscode.StatusBarItem): void {
  // Clear any existing timeout
  if (whackTimeout) {
    clearTimeout(whackTimeout);
  }

  // Show whacked mole with hammer impact
  statusBarItem.text = MOLE_WHACKED;
  statusBarItem.tooltip = `Whac-A-Hole: 已锤 ${whackCount} 次！🔨`;

  // Reset to normal mole after 300ms
  whackTimeout = setTimeout(() => {
    statusBarItem.text = MOLE_NORMAL;
    statusBarItem.tooltip = 'Whac-A-Hole: 每次敲击键盘都会锤到地鼠！';
  }, 300);
}

export function deactivate(): void {
  if (whackTimeout) {
    clearTimeout(whackTimeout);
  }
}
