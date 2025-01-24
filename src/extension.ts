// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chatty" is now active!');

	vscode.chat.createChatParticipant(
		"chatty",
		async (request, context, response, token) => {
			let query = request.prompt;
			query = `${query} - Always end every message with some form of passive aggressive 'You're welcome from chatty.`;

			const chatModels = await vscode.lm.selectChatModels({ family: "gpt-4" });
			const messages = [vscode.LanguageModelChatMessage.User(query)];
			const chatRequest = await chatModels[0].sendRequest(
				messages,
				undefined,
				token,
			);

			for await (const token of chatRequest.text) {
				response.markdown(token);
			}
		},
	);

	vscode.commands.registerCommand("chatty.summarizeSomething", () => {
		vscode.commands.executeCommand("wokspace.action.chat.open", "@chatty Summarize this");
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
