document.addEventListener('DOMContentLoaded', async () => {
    const algorithmImplementation = await getAlgorithmImplementationData();
    const algorithm = await getAlgorithmData(algorithmImplementation.algorithmId);

    await loadAlgorithmImplementation();

    document.querySelectorAll('.copy_btn').forEach(copyButton => {
        copyButton.addEventListener('click', async () => {
            try {
                const code = algorithmImplementation.code;

                if ( navigator.clipboard )
                {
                    await navigator.clipboard.writeText(code);
                    MessageSystem.float('success', 'Code copied', true, 2000);
                }
                else
                {
                    const textarea = document.createElement('textarea');
                    textarea.value = code;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    MessageSystem.float('success', 'Code copied', true, 2000);
                }
            } catch ( error ) {
                console.error('Copy failed:', error);
                MessageSystem.float('error', 'Copy failed', true, 2000);
            }
        });
    });

    async function getAlgorithmImplementationData()
    {
        const algorithmImplementationId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(algorithmImplementationId) )
        {
            throw new Error('Algorithm implementation ID is not an integer number');
        }

        const response = await getDetailedAlgorithmImplementationById(algorithmImplementationId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm implementation');
        }

        return response.data;
    }

    async function getAlgorithmData(algorithmId)
    {
        if ( !Number.isInteger(algorithmId) )
        {
            throw new Error('Algorithm ID is not an integer number');
        }

        const response = await getDetailedAlgorithmById(algorithmId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm');
        }

        return response.data;
    }

    async function loadAlgorithmImplementation()
    {
        document.getElementById('algorithm_implementation_name').textContent = algorithmImplementation.name;
        document.getElementById('code_language_notation').textContent = algorithmImplementation.codeLanguageNotation;
        document.getElementById('algorithm_complexity_notation').textContent = algorithmImplementation.algorithmComplexityNotation;
        document.getElementById('algorithm_name').textContent = algorithm.name;
        document.getElementById('description').textContent = algorithmImplementation.description;
        document.getElementById('code_text').textContent = algorithmImplementation.code;
        document.getElementById('algorithm_category_name').textContent = algorithm.algorithmCategoryName;
        document.getElementById('algorithm_complexity_name').textContent = algorithmImplementation.algorithmComplexityName;
        document.getElementById('code_language_name').textContent = algorithmImplementation.codeLanguageName;
        document.getElementById('code_language_key_string').textContent = algorithmImplementation.codeLanguageKeyString;
        document.getElementById('code_language_description').textContent = algorithmImplementation.codeLanguageDescription;
    }
});