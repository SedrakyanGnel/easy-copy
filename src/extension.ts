import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const copyContentCommand = vscode.commands.registerCommand('easy-copy.copy', async (contextFile: vscode.Uri, selectedUris: vscode.Uri[] = []) => {
        const selections = selectedUris.length ? selectedUris : [contextFile];
        const filePaths = expandFilesAndFolders(selections);

        const combinedContent = buildClipboardContent(filePaths);
        if (combinedContent) {
            await vscode.env.clipboard.writeText(combinedContent);
            vscode.window.showInformationMessage(`Copied ${filePaths.length} file(s) to clipboard.`);
        } else {
            vscode.window.showWarningMessage('No content to copy.');
        }
    });

    const copyPathsTreeCommand = vscode.commands.registerCommand('easy-copy.copyPathsTree', async (contextFile: vscode.Uri, selectedUris: vscode.Uri[] = []) => {
        const selections = selectedUris.length ? selectedUris : [contextFile];
        const filePaths = expandFilesAndFolders(selections);

        const relativePaths = filePaths
            .map(p => vscode.workspace.asRelativePath(p))
            .sort((a, b) => a.localeCompare(b));

        const tree = buildTree(relativePaths);

        await vscode.env.clipboard.writeText(tree);
        vscode.window.showInformationMessage(`Copied file structure with ${relativePaths.length} files.`);
    });

    context.subscriptions.push(copyContentCommand, copyPathsTreeCommand);
}

function expandFilesAndFolders(uris: vscode.Uri[]): string[] {
    const result: string[] = [];

    for (const uri of uris) {
        const entryPath = uri.fsPath;
        if (fs.existsSync(entryPath)) {
            if (fs.statSync(entryPath).isDirectory()) {
                result.push(...getAllFilesInDirectory(entryPath));
            } else {
                result.push(entryPath);
            }
        }
    }

    return result;
}

function getAllFilesInDirectory(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? getAllFilesInDirectory(fullPath) : [fullPath];
    });
}

function buildClipboardContent(filePaths: string[]): string {
    let combined = '';

    for (const filePath of filePaths) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const relativePath = vscode.workspace.asRelativePath(filePath);
            combined += `File: ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
        } catch {
            // Ignore unreadable files
        }
    }

    return combined.trim();
}

function buildTree(paths: string[]): string {
    const treeLines: string[] = [];
    const seen = new Set<string>();

    paths.forEach(filePath => {
        const parts = filePath.split(/[\\/]/); // handle both mac/win
        let currentPath = '';
        parts.forEach((part, idx) => {
            const isLast = idx === parts.length - 1;
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            const isFolder = !isLast || fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory();
            const display = isFolder ? `${part}/` : part;

            if (!seen.has(currentPath)) {
                const indent = '  '.repeat(idx);
                treeLines.push(`${indent}- ${display}`);
                seen.add(currentPath);
            }
        });
    });

    return treeLines.join('\n');
}

export function deactivate() { }