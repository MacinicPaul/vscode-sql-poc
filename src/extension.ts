// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sqlite.insertToDB', () => {

        const dbPath = path.join(context.extensionPath, 'data', 'example.db');
        const dbDir = path.dirname(dbPath);

        // Ensure the directory exists
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return;
            }
            console.log('Connected to the SQLite database.');

            db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    return;
                }

                db.run('INSERT INTO users (name) VALUES (?)', ['John'], function(err) {
                    if (err) {
                        console.error('Error inserting row:', err.message);
                        return;
                    }

                    db.get('SELECT * FROM users WHERE name = ?', ['John'], (err, row) => {
                        if (err) {
                            console.error('Error querying database:', err.message);
                            return;
                        }
                        console.log(row);
                        vscode.window.showInformationMessage(`The following record has been retrieved from SQLite: , ${JSON.stringify(row)}`);
                    });
                });
            });
        });
        
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

