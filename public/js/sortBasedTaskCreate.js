document.addEventListener("DOMContentLoaded", async function () {
    await loadTaskDifficultyLevels();

    constructHintElements("hints_content_container");
    renderHints();

    const form = document.getElementById("sort_based_task_create_form");
    const sortableListElement = document.getElementById("sortable_list");
    const elementsInputElement = document.getElementById("elements");
    const answerInputElement = document.getElementById("answer");
    const addSortableListElementButton = document.getElementById("add_sortable_list_element_btn");
    const newSortableListElementInput = document.getElementById("new_sortable_list_element");
    const sortableListElementsContainer = document.getElementById("sortable_list_elements_container");

    const sortableListHandler = SortableListHandler({
        list: sortableListElement,
        elementsInput: elementsInputElement,
        elementsContainer: sortableListElementsContainer,
        addElementButton: addSortableListElementButton,
        newElementInput: newSortableListElementInput,
        answerInput: answerInputElement,
        config: { editable: true, handleElements: true, displayElements: true }
    });

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