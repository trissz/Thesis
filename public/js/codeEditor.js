class CodeEditor
{
    static defaultConfiguration = {
        value: '// Write your algorithm implementation here',
        language: 'javascript',
        theme: 'vs-dark',
    };

    constructor(containerId, configuration = {})
    {
        this.containerId = containerId;

        this.configuration = {
            ...CodeEditor.defaultConfiguration,
            ...configuration,
        };

        this.instance = null;
    }

    initialize()
    {
        require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this.instance = monaco.editor.create(document.getElementById(this.containerId), {
                value: this.configuration.value,
                language: this.configuration.language,
                theme: this.configuration.theme,
            });
        });
    }

    get value()
    {
        return this.instance ? this.instance.getValue() : null;
    }

    set value(newValue)
    {
        if ( this.instance )
        {
            this.instance.setValue(newValue);
        }
    }

    get language()
    {
        return this.configuration.language;
    }

    set language(newLanguage)
    {
        if ( this.instance )
        {
            monaco.editor.setModelLanguage(this.instance.getModel(), newLanguage);
        }

        this.configuration.language = newLanguage;
    }

    get theme()
    {
        return this.configuration.theme;
    }

    set theme(newTheme)
    {
        if ( this.instance )
        {
            monaco.editor.setTheme(newTheme);
        }

        this.configuration.theme = newTheme;
    }
}