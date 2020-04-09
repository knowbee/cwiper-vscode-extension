// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
let editor = vscode.window.activeTextEditor;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.cwiper",
    function () {
      const re_single_line_comments = /(\/\/)\s*.*/gm; // comments like this (//)
      const re_empty_lines = /^\s*[\r\n]/gm;
      const re_multiline_comments = /(\{\/\*|(\/\*)).*(\*\/\}|(\*\/))/gm; //comments like {/* */} or /* */
      const re_hash_comments = /(\#)\s*.*/gm; // #
      const re_lua_single = /\-\-\s+(.+)(?<!\>)$/gm; //comments like --
      const re_lua_multi = /^(\-\-\[\[)([\s\S]*)\-\-\]\]$/gm;
      const re_jsp = /(\<\%\-).*(\%\>)$/gm; //single and multi line : <%-- --%>
      const re_ruby = /^(\=begin)[\s\S]*(\=end)$/gm; //ruby multiline comments =begin ... =end
      const re_html = /(\<\!).+(\>)/gm;

      fs.writeFileSync(
        editor.document.uri.fsPath,
        fs
          .readFileSync(editor.document.uri.fsPath, "utf-8")
          .replace(re_single_line_comments, "") //
          .replace(re_multiline_comments, "") // remove comments from files like .yaml, .py, .ts , .js
          .replace(re_hash_comments, "") // remove comments from files like .yaml, .py
          .replace(re_lua_single, "")
          .replace(re_lua_multi, "")
          .replace(re_jsp, "")
          .replace(re_ruby, "")
          .replace(re_html, "")
          .replace(re_empty_lines, "")
      );
      vscode.window.showInformationMessage("Yay!, Looking very clean.");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
