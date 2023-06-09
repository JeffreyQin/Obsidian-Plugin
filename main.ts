import { App, Editor, Notice, Plugin, moment, TFile } from 'obsidian';
import { AssistPluginSettingTab, AssistPluginSettings, DEFAULT_SETTINGS } from './assets/settings';
import { openVocabModal } from './controllers/insertVocab';
import { openTemplateModal } from './controllers/insertTemplate';
import { updateLastEditDate } from './controllers/autoDate';
import { insertHeader } from './controllers/autoHeader';
import { showNotifications, openReminderModal } from './controllers/reminder'

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

		// auto insert header

		this.registerDomEvent(document, 'keypress', (evt: KeyboardEvent) => {
			if (this.settings.autoHeader) {
				insertHeader(this.app.workspace.activeEditor!.editor!, this.settings);
			}
		});

		// show notifications

		this.registerEvent(this.app.workspace.on('resize', () => {
			if (this.settings.showNotif) {
				showNotifications(this.app, this.settings);
			}
		}));

		this.registerEvent(this.app.workspace.on('file-open', () => {
			if (this.settings.autoRemind) {
				openReminderModal(this.app, this.settings);
			}
		}));
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

