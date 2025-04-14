document.addEventListener('DOMContentLoaded', function() {
    loadAlgorithmComplexityData();
});

async function getAlgorithmComplexityData()
{
    const algorithmComplexityId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(algorithmComplexityId) )
    {
        const form = document.getElementById('algorithm_complexity_update_form');

        if ( !form.action.endsWith(algorithmComplexityId.toString()) )
        {
            form.action += algorithmComplexityId;
        }
        
        const response = await getAlgorithmComplexityById(algorithmComplexityId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm complexity');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid algorithm complexity ID');
    }
}

async function loadAlgorithmComplexityData()
{
    const algorithmComplexity = await getAlgorithmComplexityData();

    document.getElementById('name').value = algorithmComplexity.name;
    document.getElementById('notation').value = algorithmComplexity.notation;
    document.getElementById('is_active').checked = algorithmComplexity.isActive;
}