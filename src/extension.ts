// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runFilterTextCommand,FilterType,FilterSourceType} from "./modules";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "text-mini-tool" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('text-mini-tool.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from text_mini_tool!');
	}));
	context.subscriptions.push(vscode.commands.registerCommand('text-mini-tool.delDupEnterChars', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Delete Dupl Enter Chars!');
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: false,fullText:true },"\\n{2,}");
	}));
	context.subscriptions.push(vscode.commands.registerCommand('text-mini-tool.delDupEnterCharsToNewEditor', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		//vscode.window.showInformationMessage('Delete Dupl Enter Chars!');
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: true,fullText:true },"\\n{2,}");
	}));

}
// org name coffcesugar1314
// token xjv3gxwylauohwx3fs4ivikgluhmqvpgzozlweld55slvdhk3mna
// this method is called when your extension is deactivated
export function deactivate() {}
