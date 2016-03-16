import * as vscode from 'vscode';
import * as apiclient from './apiclient';
import { platform } from 'os';
import { exec, spawn } from 'child_process';
import { getLanguageExtension } from "./language"

interface UploadData {
    language: string;
    text: string;
}

export function postHastily() : void {
        var data = getUploadTextAndLanguage();   
        
        if (!data) {
            return;
        }
        
        try {
            var key = apiclient.tryUpload(data.text, data.language);
        } catch (error) {
            vscode.window.showWarningMessage("Error occured posting with haste: " + error.message);
        }
        
        function getUploadTextAndLanguage() : UploadData {
            var editor = vscode.window.activeTextEditor;

            var text;
            if (!editor) {
                return;
            }
            
            if (!editor.selection.isEmpty) {
                text = getSelectedText(editor);
            }  
            else{
                text = editor.document.getText();
            }
            
            return { language: editor.document.languageId, text: text };
        }
        
        function getSelectedText(editor: vscode.TextEditor) : string{
            return editor.document.getText(editor.selection);
        }
}

export function copyReturnedUrl(key: string, language: string) {
    
    var url = "http://hastebin.com/" + key;
    
    var extension = getLanguageExtension(language);
    
    if (extension) {
        url += `.${extension}`;
    }
            
    writeToClipboard(url);
            
    vscode.window.showInformationMessage("URL copied to clipboard: " + url);
}

function writeToClipboard(url: string) : void {
    // This is a bit rubbish!
    var platform = process ? process.platform : platform();
    
    var cmd;
    if (platform === "win32") {
        cmd = { command: "clip", args: [] };
    }
    else if (platform === "darwin") {
        cmd = { command: "pbcopy", args: [] };
    }
    else{
        cmd = { command: "xclip", args: [ "clipboard" ] }
    }
    
    try {
        var copyProcess = spawn(cmd.command, cmd.args);
        
        copyProcess.stdin.write(url);
        copyProcess.stdin.end();
    } catch (error) {
        vscode.window.showWarningMessage("Unable to access clipboard: " + error.message);
    }     
}

