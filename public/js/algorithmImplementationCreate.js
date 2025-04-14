document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadAlgorithms(),
        loadCodeLanguages(),
        loadAlgorithmComplexities()
    ]);

    const configuration = {
        value: '// Write your algorithm implementation here',
        language: 'javascript',
        theme: 'vs-dark',
    };
    
    const editor = new CodeEditor('editor', configuration);
    editor.initialize();

    const form = document.getElementById('algorithm_implementation_create_form');
    const textarea = document.getElementById('code');
    const codeLanguageDropdown = document.getElementById('code_language_id');

    if ( codeLanguageDropdown.options.length > 0 )
    {
        editor.language = codeLanguageDropdown.options[codeLanguageDropdown.selectedIndex].dataset.keyString.toLowerCase();
    }

    codeLanguageDropdown.addEventListener('change', () => {
        const selectedLanguage = codeLanguageDropdown.options[codeLanguageDropdown.selectedIndex]?.dataset.keyString.toLowerCase();
        editor.language = selectedLanguage;
    });

    form.addEventListener('submit', () => {
        textarea.value = editor ? editor.value : "No code found";
    });
});

async function loadAlgorithms()
{
    const response = await getAlgorithmsAll();
    const algorithms = response.data;
    const dropdown = document.getElementById('algorithm_id');
    dropdown.innerHTML = '';

    if ( algorithms.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No algorithms found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    algorithms.forEach(algorithm => {
        const option = document.createElement('option');
        option.value = algorithm.id;
        option.textContent = algorithm.name;
        dropdown.appendChild(option);
    });
}

async function loadCodeLanguages()
{
    const response = await getCodeLanguagesAll();
    const codeLanguages = response.data;
    const dropdown = document.getElementById('code_language_id');
    dropdown.innerHTML = '';

    if ( codeLanguages.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No code languages found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    codeLanguages.forEach(codeLanguage => {
        const option = document.createElement('option');
        option.value = codeLanguage.id;
        option.textContent = codeLanguage.name;
        option.dataset.keyString = codeLanguage.keyString;
        dropdown.appendChild(option);
    });
}

async function loadAlgorithmComplexities()
{
    const response = await getAlgorithmComplexitiesAll();
    const algorithmComplexities = response.data;
    const dropdown = document.getElementById('complexity_id');
    dropdown.innerHTML = '';

    if ( algorithmComplexities.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No algorithm complexities found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    algorithmComplexities.forEach(algorithmComplexity => {
        const option = document.createElement('option');
        option.value = algorithmComplexity.id;
        option.textContent = algorithmComplexity.name;
        dropdown.appendChild(option);
    });
}