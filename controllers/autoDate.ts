import { App, Editor, moment, Notice, TFile } from 'obsidian';
import { AssistPluginSettings } from '../assets/settings'

export async function updateLastEditDate(editor: Editor, settings: AssistPluginSettings) {
    if (settings.autoDate && 
        !editor.getValue().contains(moment().format(settings.dateFormat)) &&
        !editor.getLine(editor.getCursor().line).startsWith(settings.editDatePrefix)) {
            let lineIndex = 0;
            while (editor.getLine(lineIndex)) {
                var line = editor.getLine(lineIndex);
                if (line.startsWith(settings.editDatePrefix)) {
                    if (line.length >= settings.editDatePrefix.length + settings.dateFormat.length) {
                        editor.replaceRange(
                            moment().format(settings.dateFormat),
                            { line: lineIndex, ch: settings.editDatePrefix.length },
                            { line: lineIndex, ch: settings.editDatePrefix.length + settings.dateFormat.length }
                        )
                    } else {
                        editor.replaceRange(
                            moment().format(settings.dateFormat),
                            { line: lineIndex, ch: settings.editDatePrefix.length },
                            { line: lineIndex, ch: line.length }
                        )
                    }
                    break;
                }
                lineIndex ++;
            }
        }
}