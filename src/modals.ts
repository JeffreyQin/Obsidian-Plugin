import { SuggestModal, Editor } from 'obsidian';
import { updateLastEditDate } from '../main';
import { TextPluginSettings } from './settings';

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
		updateLastEditDate(this.editor, this.settings);
	}
}

//export class REminderModal extends Modal