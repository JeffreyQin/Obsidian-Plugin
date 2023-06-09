import AssistPlugin from "../main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface AssistPluginSettings {
    autoRemind: boolean,
	remindSymb: string;
    autoDate: boolean,
    editDatePrefix: string,
	dateFormat: string,
    autoVocab: boolean,
    insertVocab: string,
    vocabSeparation: string,
    vocabFilePath: string,
    autoTemplate: boolean,
    templateFolderPath: string,
    autoHeader: boolean,
    autoHeaderLine: string;
}

export const DEFAULT_SETTINGS: Partial<AssistPluginSettings> = {
	autoRemind: false,
    remindSymb: '@',
    autoDate: false,
    editDatePrefix: 'Last edited: ',
    dateFormat: 'YYYY-MM-DD',
    autoVocab: false,
    insertVocab: '~',
    vocabSeparation: '\n',
    vocabFilePath: 'Vocabs.md',
    autoTemplate: false,
    templateFolderPath: 'Templates/',
    autoHeader: false,
    autoHeaderLine: '___'
};

export class AssistPluginSettingTab extends PluginSettingTab {
    plugin: AssistPlugin;

    constructor(app: App, plugin: AssistPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h1', { text: 'Set Reminders'});

        new Setting(containerEl)
            .setName('Set reminders')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoRemind)
                .onChange(async (value) => {
                    if (this.plugin.settings.autoRemind) {
                        this.plugin.settings.autoRemind = false;
                    } else {
                        this.plugin.settings.autoRemind = true;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Reminder symbol')
            .addText(text => text
                .setPlaceholder('default: @')
                .setValue(this.plugin.settings.remindSymb)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.remindSymb = DEFAULT_SETTINGS.remindSymb!;
                    } else {
                        this.plugin.settings.remindSymb = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        containerEl.createEl('h1', { text: 'Auto-update Latest Edit Date'});

        new Setting(containerEl)
            .setName('Auto-update latest edit date')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoDate)
                .onChange(async (value) => {
                    if (this.plugin.settings.autoDate) {
                        this.plugin.settings.autoDate = false;
                    } else {
                        this.plugin.settings.autoDate = true;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Last edit date prefix')
            .addText(text => text
                .setPlaceholder('default: "Last edited: "')
                .setValue(this.plugin.settings.editDatePrefix)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.editDatePrefix = DEFAULT_SETTINGS.editDatePrefix!;
                    } else {
                        this.plugin.settings.editDatePrefix = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Date format')
            .addText(text => text
                .setPlaceholder('default: YYYY-MM-DD')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.dateFormat = DEFAULT_SETTINGS.dateFormat!;
                    } else {
                        this.plugin.settings.dateFormat = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        containerEl.createEl('h1', { text: 'Insert Vocabulary'});

        new Setting(containerEl)
            .setName('Insert vocabulary')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoVocab)
                .onChange(async (value) => {
                    if (this.plugin.settings.autoVocab) {
                        this.plugin.settings.autoVocab = false;
                    } else {
                        this.plugin.settings.autoVocab = true;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Insert vocabulary symbol')
            .addText(text => text
                .setPlaceholder('default: ~')
                .setValue(this.plugin.settings.insertVocab)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.insertVocab = DEFAULT_SETTINGS.insertVocab!;
                    } else {
                        this.plugin.settings.insertVocab = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Vocabulary file separation string')
            .addText(text => text
                .setPlaceholder('default: new line')
                .setValue(this.plugin.settings.vocabSeparation)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.vocabSeparation = DEFAULT_SETTINGS.vocabSeparation!;
                    } else {
                        this.plugin.settings.vocabSeparation = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Vocabulary file path')
            .addText(text => text
                .setPlaceholder('default: Vocabs.md')
                .setValue(this.plugin.settings.vocabFilePath)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.vocabFilePath = DEFAULT_SETTINGS.vocabFilePath!;
                    } else {
                        this.plugin.settings.vocabFilePath = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        containerEl.createEl('h1', { text: 'Auto-insert Template'});

        new Setting(containerEl)
            .setName('Auto-insert template')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoTemplate)
                .onChange(async (value) => {
                    if (this.plugin.settings.autoTemplate) {
                        this.plugin.settings.autoTemplate = false;
                    } else {
                        this.plugin.settings.autoTemplate = true;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Template folder path')
            .addText(text => text
                .setPlaceholder('default: Templates/')
                .setValue(this.plugin.settings.templateFolderPath)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.templateFolderPath = DEFAULT_SETTINGS.templateFolderPath!;
                    } else {
                        this.plugin.settings.templateFolderPath = input;
                    }
                    await this.plugin.saveSettings();
                })
            )

        containerEl.createEl('h1', { text: 'Auto-insert Daily Header'});

        new Setting(containerEl)
            .setName('Auto-insert daily header')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoHeader)
                .onChange(async (value) => {
                    if (this.plugin.settings.autoHeader) {
                        this.plugin.settings.autoHeader = false;
                    } else {
                        this.plugin.settings.autoHeader = true;
                    }
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName('Header line')
            .addText(text => text
                .setPlaceholder('default: ___')
                .setValue(this.plugin.settings.autoHeaderLine)
                .onChange(async (input) => {
                    if (input == '') {
                        this.plugin.settings.autoHeaderLine = DEFAULT_SETTINGS.autoHeaderLine!;
                    } else {
                        this.plugin.settings.autoHeaderLine = input;
                    }
                    await this.plugin.saveSettings();
                })
            )
    }

        
}

