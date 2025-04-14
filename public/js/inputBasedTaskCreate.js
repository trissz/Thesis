document.addEventListener("DOMContentLoaded", async function () {
    await loadTaskDifficultyLevels();

    const form = document.getElementById("input_based_task_create_form");

    constructHintElements("hints_content_container");
    renderHints();

    form.addEventListener("submit", () => {
        updateHintsInput("hints");
        sortableListHandler.updateSortedElements();
    });
});

async function loadTaskDifficultyLevels()
{
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
        dropdown.appendChild(option);
    });
}