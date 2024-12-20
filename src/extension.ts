import * as vscode from "vscode";
import initSqlJs from "sql.js";
import * as path from "path";
import * as fs from "fs";

export async function activate(context: vscode.ExtensionContext) {
  const SQL = await initSqlJs();

  // Register the command to insert a random user into the database
  const insertDisposable = vscode.commands.registerCommand(
    "sqlite.insertToDB",
    async () => {
      const dbPath = path.join(context.extensionPath, "data", "example.db");
      const dbDir = path.dirname(dbPath);

      // Ensure the directory exists
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      let db: any;
      if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
      } else {
        db = new SQL.Database();
      }

      db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)"
      );

      // Generate a random user name
      const randomUserName = `User_${Math.floor(Math.random() * 1000)}`;

      db.run("INSERT INTO users (name) VALUES (?)", [randomUserName]);

      console.log(`Inserted user: ${randomUserName}`);
      vscode.window.showInformationMessage(`Inserted user: ${randomUserName}`);

      // Write the database to file
      const data = db.export();
      fs.writeFileSync(dbPath, Buffer.from(data));
    }
  );

  // Register the command to get all users from the database
  const getAllUsersDisposable = vscode.commands.registerCommand(
    "sqlite.getAllUsers",
    async () => {
      const dbPath = path.join(context.extensionPath, "data", "example.db");

      if (!fs.existsSync(dbPath)) {
        vscode.window.showInformationMessage("No database found.");
        return;
      }

      const fileBuffer = fs.readFileSync(dbPath);
      const db = new SQL.Database(fileBuffer);

      const res = db.exec("SELECT * FROM users");
      const rows = res.length > 0 ? res[0].values : [];

      console.log("All users:", rows);
      vscode.window.showInformationMessage(
        `All users: ${JSON.stringify(rows)}`
      );
    }
  );

  context.subscriptions.push(insertDisposable);
  context.subscriptions.push(getAllUsersDisposable);
}
