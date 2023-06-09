import { App, EditorPosition, TFile } from 'obsidian';
import { AssistPluginSettings } from '../assets/settings'
import { VocabModal } from '../assets/modals'

export async function openVocabModal(app: App, settings: AssistPluginSettings) {
    const editor = app.workspace.activeEditor!.editor!;
    const location: EditorPosition = editor.getCursor();
    const vocabFile: TFile = app.vault.getMarkdownFiles().find(file => file.path == settings.vocabFilePath)!;
    const vocabList: string[] = (await app.vault.read(vocabFile!)).split(settings.vocabSeparation);
    editor.setCursor({ line: editor.getCursor().line, ch: 0 });
    new VocabModal(editor, settings, vocabList, location).open();
}
