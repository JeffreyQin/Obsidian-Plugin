import { App, Editor, Notice, Plugin, moment, TFile } from 'obsidian';
import { AssistPluginSettingTab, AssistPluginSettings, DEFAULT_SETTINGS } from './assets/settings';
import { openVocabModal } from './controllers/insertVocab';
import { openTemplateModal } from './controllers/insertTemplate'
import { updateLastEditDate } from './controllers/autoDate'

export default class AssistPlugin extends Plugin {
	settings: AssistPluginSettings;

	async onload() {

		await this.loadSettings();
		this.addSettingTab(new AssistPluginSettingTab(this.app, this));

		// update date

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			updateLastEditDate(this.app.workspace.activeEditor!.editor!, this.settings);
		})

		this.registerEvent(this.app.workspace.on('editor-paste', () => {
			updateLastEditDate(this.app.workspace.activeEditor!.editor!, this.settings);
		}))

		// insert vocab

		this.registerEvent(this.app.workspace.on('editor-change', (editor: Editor) => {
			const key = editor.getLine(editor.getCursor().line).charAt(editor.getCursor().ch - 1);
			if (this.settings.autoVocab && key == this.settings.insertVocab) {
				openVocabModal(this.app, this.settings);
			}
		}));

		// insert template

		setTimeout(() => {
			this.registerEvent(this.app.vault.on('create', (file: TFile) => {
				if (this.settings.autoTemplate && file.path.endsWith('.md')) {
					setTimeout(() => {
						openTemplateModal(this.app, this.settings);
					}, 100);
				}
			}))
		}, 100);


		/*
		//------------------------------------------------------------------------------------------------DATE INSERTION / UDDATES
		// updates last edit date upon any changes to the editor

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			updateLastEditDate(this.app.workspace.activeEditor!.editor!, this.settings);
		})

		this.registerEvent(this.app.workspace.on('editor-paste', () => {
			updateLastEditDate(this.app.workspace.activeEditor!.editor!, this.settings);
		}));

		// insert date at cursor place and replace latest edit date through ribbon icon

		const ribbonIconInsertDate = this.addRibbonIcon('calendar', 'Insert Date', (evt: MouseEvent) => {
			let editor = this.app.workspace.activeEditor!.editor!;
			editor.replaceRange(moment().format(this.settings.dateFormat), editor.getCursor());
			updateLastEditDate(editor, this.settings);
		});	

	//------------------------------------------------------------------------------------------ ADDING PEOPLE

		// adding first person to "people list"

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const editor = this.app.workspace.activeEditor!.editor!
			if (editor.getLine(editor.getCursor().line).startsWith(this.settings.peopleStr) &&
				editor.getLine(editor.getCursor().line).length <= this.settings.peopleStr.length + 1) {
					openPeopleSuggestionModal(this.app, this.settings, 0);
			}
		});

		// adding people through comma (in "people list" only) or tag symbol

		this.registerEvent(this.app.workspace.on('editor-change', (editor: Editor) => {
			const key = editor.getLine(editor.getCursor().line).charAt(editor.getCursor().ch - 1);
			if (key.localeCompare(this.settings.tagSymb) == 0) {
				openPeopleSuggestionModal(this.app, this.settings, 1);
			} else if (editor.getLine(editor.getCursor().line).startsWith(this.settings.peopleStr) && key.localeCompare(',') == 0) {
				openPeopleSuggestionModal(this.app, this.settings, 0);
			}
		}));

		// adding people through ribbon icon

		const ribbonIconAddPeople = this.addRibbonIcon('user', 'Add People', (evt: MouseEvent) => {
			openPeopleSuggestionModal(this.app, this.settings, 2);
		});

		// cursor relocation

		this.registerInterval(window.setInterval(() => {
			let editor = this.app.workspace.activeEditor!.editor!
			if (editor.getLine(editor.getCursor().line + 1).startsWith(this.settings.peopleStr) && editor.getCursor().ch == 0) {
				editor.setCursor({ line: editor.getCursor().line + 1, ch: editor.getLine(editor.getCursor().line + 1).length })
			}
		}, 100));
		
		//------------------------------------------------------------------------------------------------------------ AUTO DATE & NAME INSERTION

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			generateAutoText(this.app, this.app.workspace.activeEditor!.editor!, this.settings);
		});

		//-------------------------------------------------------------------------------------------------------------- INSERT TEMPLATE

		
		setTimeout(() => {
			this.registerEvent(this.app.vault.on('create', (file: TFile) => {
				setTimeout(() => {
					if (file.path.endsWith('.md')) {
						openTemplateSuggestionModal(this.app, this.settings);
					}
				}, 100);
			}));
		}, 100);
		
		*/
		
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

