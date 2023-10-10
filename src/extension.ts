import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspaceRoot = workspaceFolders[0].uri.fsPath;
      const configFilePath = path.join(workspaceRoot, 'no-edit.json');

      if (fs.existsSync(configFilePath)) {
        const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

        // Function to check and prevent edits
        const checkAndPreventEdits = (document: vscode.TextDocument) => {
          const filePath = document.uri.fsPath;
          
          if (config.forbiddenFiles.includes(path.relative(workspaceRoot, filePath))) {
            vscode.commands.executeCommand('workbench.action.files.revert');
          }
        };

        // Subscribe to text document save and change events
        vscode.workspace.onDidSaveTextDocument(checkAndPreventEdits);
        vscode.workspace.onDidChangeTextDocument(event => checkAndPreventEdits(event.document));
      }
    }
}

export function deactivate() {}
