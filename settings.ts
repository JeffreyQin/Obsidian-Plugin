
import TextPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

// setting tab for textPlugin
// to be imported by main.ts

export class TextPluginSettingTab extends PluginSettingTab {
    plugin: TextPlugin;

    constructor(app: App, plugin: TextPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h1', { text: 'Tags & notices' });

        new Setting(containerEl)
            .setName('Username')
            .setDesc('How other users will identify you in tags, notices, etc.')
            .addText(text => text
                .setPlaceholder('enter string')
                .setValue(this.plugin.settings.username)
                .onChange(async (input) => {
                    this.plugin.settings.username = input;
                    await this.plugin.saveSettings();
                })
            )
        
        containerEl.createEl('h1', { text: 'Insert & update edit dates'});
        
        new Setting(containerEl)
            .setName('Keyword: latest edit date')
            .addText(text => text
                .setPlaceholder('enter string')
                .setValue(this.plugin.settings.lastEditDateStr)
                .onChange(async (input) => {
                    this.plugin.settings.lastEditDateStr = input;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(containerEl)
            .setName('Date format')
            .setDesc('Format used in inserting / editing dates.')
            .addText(text => text
                .setPlaceholder('enter string')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (input) => {
                    this.plugin.settings.dateFormat = input;
                    await this.plugin.saveSettings();
                })
            )
        
        containerEl.createEl('h1', { text: 'Insert names & people'})
        
        new Setting(containerEl)
            .setName('Keyword: people added')
            .addText(text => text
                .setPlaceholder('enter string') 
                .setValue(this.plugin.settings.peopleStr)
                .onChange(async (input) => {
                    this.plugin.settings.peopleStr = input;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(containerEl)
            .setName('Name list file')
            .setDesc('File that stores all candidates for names to be added')
            .addText(text => text
                .setPlaceholder('enter string')
                .setValue(this.plugin.settings.peopleListFileName)
                .onChange(async (input) => {
                    this.plugin.settings.peopleListFileName = input;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(containerEl)
            .setName('Name list separator')
            .setDesc('Symbol/phrase that separates individual names in the name list file')
            .addText(text => text
                .setPlaceholder('enter string')
                .setValue(this.plugin.settings.suggestionSplitStr)
                .onChange(async (input) => {
                    this.plugin.settings.suggestionSplitStr = input;
                    await this.plugin.saveSettings();
                })
            )
    }
}


