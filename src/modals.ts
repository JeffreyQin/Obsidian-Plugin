import { SuggestModal, Modal, Editor, ButtonComponent, Notice } from 'obsidian';
import { updateLastEditDate } from '../main';
import { TextPluginSettings } from './settings';

// ask to notify modal

export class NotifyModal extends Modal {

	constructor() {
		super(app);
	}

	onOpen() {
		const notifyText = this.contentEl.createEl('h1', { text: 'Notify user?'});
		const notifyButton = new ButtonComponent(this.contentEl)
			.setButtonText('Yes?')
			.onClick(() => {
				new Notice('User will be notified!');
				this.close();
			})
		}
}

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
		this.editor.replaceRange(
			this.settings.tagSymb + item,
			{ line: this.editor.getCursor().line, ch: this.editor.getCursor().ch - 1 },
			this.editor.getCursor()
		)
		new NotifyModal().open();
		updateLastEditDate(this.editor, this.settings);
	}
}
