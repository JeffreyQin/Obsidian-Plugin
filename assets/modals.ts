import { App, SuggestModal, Editor, TFile, EditorPosition, Modal, ButtonComponent } from 'obsidian';
import { updateLastEditDate } from '../controllers/autoDate';
import { AssistPluginSettings } from './settings';


export class ReminderModal extends Modal {

	editor: Editor;
	settings: AssistPluginSettings;

	constructor(editor: Editor, settings: AssistPluginSettings) {
		super(app);
		this.editor = editor;
		this.settings = settings;
	}

	onOpen() {
		const reminderText = this.contentEl.createEl('h2', { text: 'You have an unresolved reminder.' })
		const reminderResolveButton = new ButtonComponent(this.contentEl)
			.setButtonText('Resolved')
			.onClick(() => {
				const oldContent = this.editor.getValue();
				const newContent = oldContent.replace(new RegExp(this.settings.reminderSymb, 'gi'), '');
				this.app.vault.modify(this.app.workspace.getActiveFile()!, newContent);
				this.close();
			});
		}
	onClose() {
	}
}

export class TemplateModal extends SuggestModal<TFile> {

	private editor: Editor;
	private settings: AssistPluginSettings;
	private suggestionList: TFile[];

	constructor(editor: Editor, settings: AssistPluginSettings, suggestionList: TFile[]) {
		super(app);
		this.editor = editor;
		this.settings = settings;
		this.suggestionList = suggestionList;
	}

	getSuggestions(query: string): TFile[] {
		return this.suggestionList.filter((item) => item.path.toLowerCase().includes(query.toLowerCase()));
	}
	renderSuggestion(item: TFile, el: HTMLElement) {
		el.createEl("div", { text: item.path.substring(this.settings.templateFolderPath.length, item.path.length - 3) })
	}
	async onChooseSuggestion(item: TFile, evt: MouseEvent | KeyboardEvent) {
		let content: string = await this.app.vault.read(item);
		this.editor.replaceRange(content, { line: 0, ch: 0});
		updateLastEditDate(this.editor, this.settings);
	}
}

export class VocabModal extends SuggestModal<string> {

	private editor: Editor;
	private settings: AssistPluginSettings;
	private suggestionList: string[];
	private insertLocation: EditorPosition;

	constructor(editor: Editor, settings: AssistPluginSettings, suggestionList: string[], insertLocation: EditorPosition) {
		super(app);
		this.editor = editor;
		this.settings = settings;
		this.suggestionList = suggestionList;
		this.insertLocation = insertLocation;
	}

	getSuggestions(query: string): string[] {
		return this.suggestionList.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
	}
	renderSuggestion(item: string, el: HTMLElement) {
		el.createEl("div", { text: item });
	}
	onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
		this.editor.replaceRange(item, this.insertLocation);
		updateLastEditDate(this.editor, this.settings);
		this.editor.setCursor({
			line: this.insertLocation.line,
			ch: this.insertLocation.ch + item.length
		});
	}
}
