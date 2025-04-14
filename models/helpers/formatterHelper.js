const prettier = require('prettier');

class FormatterHelper
{
    formatCode(inputCode, options = {})
    {
        const defaultOptions = {
            semi: true,
            singleQuote: true,
            trailingComma: "es5",
            tabWidth: 2,
            useTabs: false,
            printWidth: 80,
            bracketSpacing: true,
            arrowParens: "always",
            htmlWhitespaceSensitivity: "css",
            endOfLine: "lf",
            jsxSingleQuote: false,
            jsxBracketSameLine: false,
            parser: 'babel', // Default to JavaScript
        };

        const finalOptions = { ...defaultOptions, ...options };
        return prettier.format(inputCode, finalOptions);
    }
}

module.exports = FormatterHelper;