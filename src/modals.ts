import { SuggestModal, Modal, Editor, ButtonComponent, Notice } from 'obsidian';
import { updateLastEditDate } from '../main';
import { TextPluginSettings } from './settings';

// ask to notify modal

export class NotifyModal extends Modal {

	editor: Editor;
	settings: TextPluginSettings;
	name: string;

	constructor(name: string, settings: TextPluginSettings) {
		super(app);
		this.editor = this.app.workspace.activeEditor!.editor!;
		this.settings = settings;
		this.name = name;
	}

	onOpen() {
		const notifyText = this.contentEl.createEl('h1', { text: 'Notify user?'});
		const notifyButton = new ButtonComponent(this.contentEl)
			.setButtonText('Yes')
			.onClick(() => {
				new Notice(this.name + ' will be notified');
				this.editor.replaceRange(
					this.settings.noticeSymb,
					{ line: this.editor.getCursor().line, ch: this.editor.getCursor().ch - this.name.length }
				)
				this.close();
			})
		}
}

// suggestion modal

export class SuggestionModal extends SuggestModal<string> {

	private editor: Editor;
	private settings: TextPluginSettings;
	private suggestionList: string[];

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
		new NotifyModal(item, this.settings).open();
		updateLastEditDate(this.editor, this.settings);
	}
}
