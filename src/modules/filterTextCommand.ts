import * as vscode from "vscode";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelectionsOrFullDocument,getFullDocumentRange, replaceSelectionsWithLines, showHistoryQuickPick ,createNewEditor,showHistoryQuickPickWithDefaultValue} from "../helpers/vsCodeHelpers";
import { NO_ACTIVE_EDITOR } from "../consts";

export enum FilterType {
	Include,
	Exclude
}

export enum FilterSourceType {
	String,
	Regex
}

interface IFilterTextCommandOptions {
	type: FilterType;
	sourceType: FilterSourceType;
	inNewEditor: boolean;
	fullText: boolean;
}

export async function runFilterTextCommand(context: vscode.ExtensionContext, options: IFilterTextCommandOptions, quickAction:string='') {
	const settings = getExtensionSettings();

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log(vscode.window.visibleTextEditors);
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}
	let title = options.sourceType === FilterSourceType.String
	? "Please enter the filter text"
	: "Please enter the filter regular expression";
	// = quickAction !== '' ? quickAction:''
	showHistoryQuickPickWithDefaultValue('\\n{2,}',{
		context: context,
		title: title,
		historyStateKey: "filterText-" + options.sourceType.toString(),
		onDidAccept: async (filter: string) => {
			if (!filter) {
				return;
			}

			if (settings.caseSensitiveFiltering === false) {
				filter = filter.toLocaleLowerCase();
			}

			
			const selections = getSelectionsOrFullDocument(editor);
			if (options.fullText) {
				let lines = [];
				for (const selection of selections) {
					for (const lineContent of getSelectionLines(editor, selection)) {
						let matched: boolean = false;
						lines.push(lineContent);
					}
				}
				let text = lines.join('\n');
				let flags = '';
				if(settings.caseSensitiveFiltering === false){
					flags+='i';
				}
				flags+='g';
				const regexObject = options.sourceType === FilterSourceType.Regex ? new RegExp(filter, flags) : new RegExp("");
				text = text.replace(regexObject,'\n');
				let targetEditor:vscode.TextEditor;
				if (options.inNewEditor === true) {
					targetEditor = await createNewEditor();
				} else {
					targetEditor=editor;
				}
				targetEditor.edit((editBuilder) => {
					for (let i = 0; i < selections.length; i++) {
						editBuilder.replace(getFullDocumentRange(targetEditor),text);
					}
				});
			} else {
				const regexObject = options.sourceType === FilterSourceType.Regex ? new RegExp(filter, settings.caseSensitiveFiltering === false ? "i" : undefined) : new RegExp("");
				const matchingLinesBySelection: string[][] = [];
				for (const selection of selections) {
					matchingLinesBySelection.push([]);

					for (const lineContent of getSelectionLines(editor, selection)) {
						let matched: boolean = false;
						if (options.sourceType === FilterSourceType.String) {
							matched = (settings.caseSensitiveFiltering ? lineContent : lineContent.toLocaleLowerCase()).indexOf(filter) !== -1;
						} else {
							matched = regexObject.test(lineContent);
						}

						if (options.type === FilterType.Exclude) {
							matched = !matched;
						}

						if (matched) {
							matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
						}
					}
				}
				await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, options.inNewEditor);
			}

			
		}
	});
}
