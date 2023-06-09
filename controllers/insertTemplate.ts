import { App, TFile } from 'obsidian';
import { AssistPluginSettings } from '../assets/settings';
import { TemplateModal } from '../assets/modals';

export async function openTemplateModal(app: App, settings: AssistPluginSettings) {
    const files: TFile[] = app.vault.getMarkdownFiles();
    const templateList: TFile[] = [];
    for (let index = 0; index < files.length; index++) {
        if (files[index].path.startsWith(settings.templateFolderPath)) {
            templateList.push(files[index]);
        }
    }
    new TemplateModal(app.workspace.activeEditor!.editor!, settings, templateList).open();
}