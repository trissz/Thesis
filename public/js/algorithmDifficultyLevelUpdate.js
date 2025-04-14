document.addEventListener('DOMContentLoaded', function() {
    loadAlgorithmDifficultyLevelData();
});

async function getAlgorithmDifficultyLevelData()
{
    const algorithmDifficultyLevelId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(algorithmDifficultyLevelId) )
    {
        const form = document.getElementById('algorithm_difficulty_level_update_form');

        if ( !form.action.endsWith(algorithmDifficultyLevelId.toString()) )
        {
            form.action += algorithmDifficultyLevelId;
        }
        
        const response = await getAlgorithmDifficultyLevelById(algorithmDifficultyLevelId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm difficulty level');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid algorithm difficulty level ID');
    }
}

async function loadAlgorithmDifficultyLevelData()
{
    const algorithmDifficultyLevel = await getAlgorithmDifficultyLevelData();

    document.getElementById('name').value = algorithmDifficultyLevel.name;
    document.getElementById('description').value = algorithmDifficultyLevel.description;
    document.getElementById('is_active').checked = algorithmDifficultyLevel.isActive;
}