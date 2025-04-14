document.addEventListener('DOMContentLoaded', () => {
    const configuration = {
        value: '// Write your P5.js algorithm implementation here',
        language: 'javascript',
        theme: 'vs-dark',
    };
    
    const editor = new CodeEditor('editor', configuration);
    editor.initialize();

    const form = document.getElementById('visualization_create_form');
    const textarea = document.getElementById('script_code');
    const fileInput = document.getElementById('script_file');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if ( file && file.name.endsWith('.js') )
        {
            const reader = new FileReader();

            reader.onload = function (e) {
                const scriptContent = e.target.result;
                editor.value = scriptContent;
            };

            reader.readAsText(file);
        }
        else if ( file )
        {
            alert('Please upload a valid .js file!');
            fileInput.value = '';
        }
    });

    form.addEventListener('submit', () => {
        textarea.value = editor ? editor.value : "No code found";
    });
});