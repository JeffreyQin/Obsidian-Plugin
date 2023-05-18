import { Plugin, App, Editor, Notice, TFile } from 'obsidian';
import TextPlugin from '../main';
import { TextPluginSettings } from './settings';

export function loadNotifications(settings: TextPluginSettings) {
    const files: TFile[] = this.app.vault.getMarkdownFiles();
    for (let index = 0; index < files.length; index++) {
        this.app.vault.read(files[index]).then((content: string) => {
            let notificationString: string = settings.tagSymb + settings.noticeSymb + settings.username;
            if (content.contains(notificationString)) {
                new Notice('You have an unresolved notice in ' + files[index].path);
            }
        })
    }
}

