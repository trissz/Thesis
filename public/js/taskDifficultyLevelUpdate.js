document.addEventListener('DOMContentLoaded', function() {
    loadTaskDifficultyLevelData();
});

async function getTaskDifficultyLevelData()
{
    const taskDifficultyLevelId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(taskDifficultyLevelId) )
    {
        const form = document.getElementById('task_ifficulty_level_update_form');

        if ( !form.action.endsWith(taskDifficultyLevelId.toString()) )
        {
            form.action += taskDifficultyLevelId;
        }

        const response = await getTaskDifficultyLevelById(taskDifficultyLevelId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch task difficulty level');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid task difficulty level ID');
    }
}

async function loadTaskDifficultyLevelData()
{
    const taskDifficultyLevel = await getTaskDifficultyLevelData();

    document.getElementById('name').value = taskDifficultyLevel.name;
    document.getElementById('description').value = taskDifficultyLevel.description;
    document.getElementById('is_active').checked = taskDifficultyLevel.isActive;
}