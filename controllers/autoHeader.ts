import { App, Editor, moment } from 'obsidian';
import { AssistPluginSettings } from '../assets/settings'

export function disabledArea(editor: Editor, settings: AssistPluginSettings) {
    if (!(editor.getLine(editor.getCursor().line) == "")) {
        return true;
    }
    for (let index = 0; index < editor.getCursor().line; index++) {
        if (editor.getLine(index).startsWith(settings.autoHeaderLine)) {
            return true;
        }
    }
    return false;
}

export function insertHeader(editor: Editor, settings: AssistPluginSettings) {
    if (!disabledArea(editor, settings)) {
        editor.replaceRange(
            `\n\n${settings.autoHeaderLine}\n${moment().format(settings.dateFormat)}`,
            { line: editor.getCursor().line - 1, ch: editor.getLine(editor.getCursor().line - 1).length } 
        )
        editor.replaceRange(
            '\n',
            { line: editor.getCursor().line + 1, ch: 0 }
        )
    }
}