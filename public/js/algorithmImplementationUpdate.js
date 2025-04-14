document.addEventListener('DOMContentLoaded', function() {
    loadAlgorithmImplementationData();
});

async function getAlgorithmImplementationData()
{
    const algorithmImplementationId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(algorithmImplementationId) )
    {
        const form = document.getElementById('algorithm_implementation_update_form');

        if ( !form.action.endsWith(algorithmImplementationId.toString()) )
        {
            form.action += algorithmImplementationId;
        }
        
        const response = await getAlgorithmImplementationById(algorithmImplementationId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm implementation');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid algorithm implementation ID');
    }
}

async function loadAlgorithmImplementationData()
{
    const algorithmImplementation = await getAlgorithmImplementationData();

    document.getElementById('algorithm_id').value = algorithmImplementation.algorithmId;
    document.getElementById('code_language_id').value = algorithmImplementation.codeLanguageId;
    document.getElementById('complexity_id').value = algorithmImplementation.complexityId;
    document.getElementById('name').value = algorithmImplementation.name;
    document.getElementById('description').value = algorithmImplementation.description;
    document.getElementById('code').value = algorithmImplementation.code;
    document.getElementById('is_active').checked = algorithmImplementation.isActive;
}