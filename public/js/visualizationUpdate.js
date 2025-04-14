document.addEventListener('DOMContentLoaded', async function() {
    await Promise.all([
        loadVisualizationData()
    ]);

    const configuration = {
        value: document.getElementById('script_code').value,
        language: 'javascript',
        theme: 'vs-dark',
    };
    
    const editor = new CodeEditor('editor', configuration);
    editor.initialize();

    const form = document.getElementById('visualization_update_form');
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

async function getVisualizationData()
{
    const visualizationId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(visualizationId) )
    {
        const form = document.getElementById('visualization_update_form');

        if ( !form.action.endsWith(visualizationId.toString()) )
        {
            form.action += visualizationId;
        }

        const response = await getVisualizationById(visualizationId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch visualization');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid visualization ID');
    }
}

async function loadVisualizationData()
{
    const visualization = await getVisualizationData();

    document.getElementById('title').value = visualization.title;
    document.getElementById('description').value = visualization.description;
    document.getElementById('script_code').value = visualization.scriptCode;
    document.getElementById('is_active').checked = visualization.isActive;
}