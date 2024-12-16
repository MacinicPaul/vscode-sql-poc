## POC for adding SQLite to a custom VsCode extension

A POC that contains a VSCode command which:

1. creates a new instance of an SQLite DB
2. creates an `users` table
3. inserts a John record into the table
4. retrieves the row and displays the data in an vscode alert

To run the POC please do the following:

1. run `npm i` in the root
2. run `npm compile` in the root
3. press `F5` to run and debug the extension
4. press `CTRL/CMD + Shift + P` to open the command panel and search for `Insert to SQLite`
5. run the `Insert to SQLite` command
