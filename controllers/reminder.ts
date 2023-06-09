import { App, EditorPosition, TFile, Notice } from 'obsidian';
import { AssistPluginSettings } from '../assets/settings'
import { ReminderModal } from '../assets/modals'

export async function showNotifications(app: App, settings: AssistPluginSettings) {
    const files: TFile[] = app.vault.getMarkdownFiles();
    for (let index = 0; index < files.length; index++) {
        var content = await app.vault.read(files[index]);
        if (content.contains(settings.reminderSymb)) {
            new Notice(`You have a reminder in + ${files[index].path}.`);
        }
    }
}

export async function openReminderModal(app: App, settings: AssistPluginSettings) {
    const content = await app.vault.read(app.workspace.getActiveFile()!);
    if (content.contains(settings.reminderSymb)) {
        new ReminderModal(app.workspace.activeEditor!.editor!, settings).open();
    }
}