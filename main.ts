import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, moment, SuggestModal } from 'obsidian';
import { TextPluginSettingTab, TextPluginSettings, DEFAULT_SETTINGS } from './settings';

// suggestion modal

export class SuggestionModal extends SuggestModal<string> {

	editor: Editor;
	settings: TextPluginSettings;
	suggestionList: string[];

	constructor(editor: Editor, settings: TextPluginSettings, suggestionList: string[]) {
		super(app);
		this.editor = editor;
		this.settings = settings;
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
		updateLastEditDate(this.editor, this.settings);
	}
}

export function updateLastEditDate(editor: Editor, settings: TextPluginSettings) {
	let lineIndex = 0;
	while (editor.getLine(lineIndex)) {
		if (editor.getLine(lineIndex).startsWith(settings.lastEditDateStr)) {
			editor.replaceRange(
				moment().format(settings.dateFormat),
				{ line: lineIndex, ch: settings.lastEditDateStr.length + 1 },
				{ line: lineIndex, ch: settings.lastEditDateStr.length + settings.dateFormat.length + 1 },
			);
			break;
		}
		lineIndex ++;	
	}
}

export default class TextPlugin extends Plugin {
	settings: TextPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TextPluginSettingTab(this.app, this));

		// updates last edit date upon any keys pressed

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor.editor == null) {
				return;
			}
			updateLastEditDate(this.app.workspace.activeEditor!.editor!, this.settings);
		});
		
		// adding name (opening suggestion modal) but double clicking on the same line as the name keyword

		this.registerDomEvent(document, 'dblclick', (evt: MouseEvent) => {
			if (this.app.workspace.activeEditor == null || this.app.workspace.activeEditor.editor == null) {
				return;
			}
			let editor = this.app.workspace.activeEditor!.editor!;
			if (editor.getLine(editor.getCursor().line).startsWith(this.settings.peopleStr)) {
				const files: TFile[] = this.app.vault.getMarkdownFiles();
				for (let index = 0; index < files.length; index++) {
					if (files[index].path.localeCompare(this.settings.peopleListFileName + '.md') == 0) {
						this.app.vault.read(files[index]).then((value) => {
							let suggestionList: string[] = value.split(this.settings.suggestionSplitStr);
							new SuggestionModal(editor, this.settings, suggestionList).open();
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
				if (files[index].path.localeCompare(this.settings.peopleListFileName + '.md') == 0) {
					this.app.vault.read(files[index]).then((value) => {
						let nameList: string[] = value.split('\n');
						new SuggestionModal(editor, this.settings, nameList).open();
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
			editor.replaceRange(moment().format(this.settings.dateFormat), editor.getCursor());
			updateLastEditDate(editor, this.settings);
		});	

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

