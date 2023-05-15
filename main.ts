import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, moment, SuggestModal } from 'obsidian';

var lastEditDateStr = "updatedDate:"
var dateFormat = "YYYY-MM-DD";

var peopleStr = "people:";
var typeStr = "type:";
var peopleListFilePath = "collaborator.md";
var typeListFilePath = "category.md";
var suggestionSplitStr = '\n';

interface PluginSettings {
	setting: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	setting: 'default'
}

// SUGGESTION MODAL

export class SuggestionModal extends SuggestModal<string> {

	editor: Editor;
	suggestionList: string[];

	constructor(editor: Editor, suggestionList: string[]) {
		super(app);
		this.editor = editor;
		this.suggestionList = suggestionList;
	}
	
	getSuggestions(query: string): string[] {
		return this.suggestionList.filter(
			(item) => item.toLowerCase().includes(query.toLowerCase())
		)
	}
	renderSuggestion(item: string, el: HTMLElement) {
		el.createEl("div", { text: item });
	}
	onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
		this.editor.replaceRange(item, this.editor.getCursor());
	    updateLastEditDate(this.editor);
	}
}
	
// UPDATES LATEST EDIT DATE

export function updateLastEditDate(editor: Editor) {
	let lineIndex = 0;
	while (editor.getLine(lineIndex)) {
		if (editor.getLine(lineIndex).startsWith(lastEditDateStr)) {
			editor.replaceRange(
				moment().format(dateFormat),
				{ line: lineIndex, ch: lastEditDateStr.length + 1 },
				{ line: lineIndex, ch: lastEditDateStr.length + dateFormat.length + 1 },
			);
			break;
		}
		lineIndex ++;	
	}
}

export default class QuickTextPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
	
		// updates last edit date upon any keys pressed

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor.editor == null) {
				return;
			}
			updateLastEditDate(this.app.workspace.activeEditor!.editor!);
		});
	
		// adding quick text (opening suggestion modal) but double clicking on the same line as keywords

		this.registerDomEvent(document, 'dblclick', (evt: MouseEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor.editor == null) {
				return;
			}
			let editor = this.app.workspace.activeEditor!.editor!;
			let pathToLocate: string = "";
			let keywordFound = false;
			if (editor.getLine(editor.getCursor().line).startsWith(peopleStr)) {
				pathToLocate = peopleListFilePath;
				keywordFound = true;
			} else if (editor.getLine(editor.getCursor().line).startsWith(typeStr)) {
				pathToLocate = typeListFilePath;
				keywordFound = true;
			}
			if (keywordFound) {
				const files: TFile[] = this.app.vault.getMarkdownFiles();
				for (let index = 0; index < files.length; index++) {
					if (files[index].path.localeCompare(pathToLocate) == 0) {
						this.app.vault.read(files[index]).then((value) => {
							let suggestionList: string[] = value.split(suggestionSplitStr);
							new SuggestionModal(editor, suggestionList).open();
						})
					}
				}
			}
		});
	
		// adding people (opening suggestion modal) anywhere on the editor through ribbon icon

		const ribbonIconAddPeople = this.addRibbonIcon('user', 'Add People', (evt: MouseEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor.editor == null) {
				return;
			}
			let editor = this.app.workspace.activeEditor!.editor!;
			const files: TFiles[] = this.app.vault.getMarkdownFiles();
			for (let index = 0; index < files.length; index++) {
				if (files[index].path.localeCompare(peopleListFilePath) == 0) {
					this.app.vault.read(files[index]).then((value) => {
						let nameList: string[] = value.split('\n');
						new SuggestionModal(editor, nameList).open();
					})
				}
			}
		});

		// insert date at cursor place and replace latest edit date through ribbon icon

		const ribbonIconInsertDate = this.addRibbonIcon('calendar', 'Insert Date', (evt: MouseEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor?.editor == null) {
				return;
			}
			let editor = this.app.workspace.activeEditor!.editor!;
			editor.replaceRange(moment().format(dateFormat), editor.getCursor());
			updateLastEditDate(editor);
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
