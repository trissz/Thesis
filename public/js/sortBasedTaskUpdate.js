document.addEventListener('DOMContentLoaded', async () => {
    await loadSortBasedTaskData();
});

async function getSortBasedTaskData()
{
    const sortBasedTaskId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(sortBasedTaskId) )
    {
        const form = document.getElementById("sort_based_task_update_form");

        if ( !form.action.endsWith(sortBasedTaskId.toString()) )
        {
            form.action += sortBasedTaskId;
        }
        
        const response = await getSortBasedTaskById(sortBasedTaskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch sort based task');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid sort based task ID');
    }
}

async function loadSortBasedTaskData()
{
    const sortBasedTask = await getSortBasedTaskData();
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
        option.selected = taskDifficultyLevel.id == sortBasedTask.difficultyLevelId;

        if ( sortBasedTask.difficulty_level_id === taskDifficultyLevel.id )
        {
            option.selected = true;
        }

        dropdown.appendChild(option);
    });

    document.getElementById("content").value = sortBasedTask.content;
    document.getElementById("is_active").checked = sortBasedTask.isActive;

    hints = sortBasedTask.hints ? JSON.parse(sortBasedTask.hints) : [];
    constructHintElements("hints_content_container");
    renderHints();

    const form = document.getElementById("sort_based_task_update_form");
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

    const elements = sortBasedTask.elements ? JSON.parse(sortBasedTask.elements) : [];
    
    sortableListHandler.renderElements(elements);
    elements.forEach(sortableListHandler.addElement);

    form.addEventListener("submit", function () {
        sortableListHandler.updateSortedElements();
        updateHintsInput();
    });
}