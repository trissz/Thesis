document.addEventListener('DOMContentLoaded', async function() {
    await loadInputBasedTaskData();
});

async function getInputBasedTaskData()
{
    const inputBasedTaskId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(inputBasedTaskId) )
    {
        const form = document.getElementById('input_based_task_update_form');

        if ( !form.action.endsWith(inputBasedTaskId.toString()) )
        {
            form.action += inputBasedTaskId;
        }
        
        const response = await getInputBasedTaskById(inputBasedTaskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch input based task');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid input based task ID');
    }
}

async function loadInputBasedTaskData()
{
    const inputBasedTask = await getInputBasedTaskData();
    const form = document.getElementById("input_based_task_update_form");

    const response = await getTaskDifficultyLevelsAll();
    const taskDifficultyLevels = response.data;
    
    const dropdown = document.getElementById('difficulty_level_id');
    dropdown.innerHTML = '';

    if ( taskDifficultyLevels.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No task difficulty levels found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    taskDifficultyLevels.forEach(taskDifficultyLevel => {
        const option = document.createElement('option');
        option.value = taskDifficultyLevel.id;
        option.textContent = taskDifficultyLevel.name;
        option.selected = taskDifficultyLevel.id == inputBasedTask.difficultyLevelId;

        if ( inputBasedTask.difficulty_level_id === taskDifficultyLevel.id )
        {
            option.selected = true;
        }

        dropdown.appendChild(option);
    });

    document.getElementById("content").value = inputBasedTask.content;
    document.getElementById('answer').value = inputBasedTask.answer;
    document.getElementById("is_active").checked = inputBasedTask.isActive;

    hints = inputBasedTask.hints ? JSON.parse(inputBasedTask.hints) : [];
    constructHintElements("hints_content_container");
    renderHints();

    form.addEventListener("submit", function () {
        updateHintsInput();
    });
}