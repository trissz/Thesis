document.addEventListener('DOMContentLoaded', function() {
    loadAlgorithmData();
});

async function getAlgorithmData()
{
    const algorithmId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(algorithmId) )
    {
        const form = document.getElementById('algorithm_update_form');

        if ( !form.action.endsWith(algorithmId.toString()) )
        {
            form.action += algorithmId;
        }
        
        const response = await getAlgorithmById(algorithmId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid algorithm ID');
    }
}

async function loadAlgorithmData()
{
    const algorithm = await getAlgorithmData();

    document.getElementById('category_id').value = algorithm.categoryId;
    document.getElementById('difficulty_level_id').value = algorithm.difficultyLevelId;
    document.getElementById('name').value = algorithm.name;
    document.getElementById('is_active').checked = algorithm.isActive;
}