document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById("select_based_task_update_form");
    const newOptionInput = document.getElementById("new_option");
    const addOptionButton = document.getElementById("add_option_btn");
    const optionsListElement = document.getElementById("options_list");
    const optionElementsContainer = document.getElementById("options_elements_container");
    const answerInput = document.getElementById("answer");
    const clearSelectionsButton = document.getElementById("clear_selection_btn");
    const maxSelectionsInput = document.getElementById("max_selections_input");
    const decreaseCounterButton = document.getElementById("decrease_counter_btn");
    const increaseCounterButton = document.getElementById("increase_counter_btn");
    const optionsInput = document.getElementById("options");
    const selectableElementsHandler = SelectableElementsHandler([], selectBasedTaskDataset.defaultMaxSelections);

    await loadSelectBasedTaskData(addOption);
    selectableElementsHandler.updateElements();
    updateMaxSelection(document.querySelectorAll(".selectable.selected").length);
    initializeEventListeners();

    function initializeEventListeners()
    {
        addOptionButton.addEventListener("click", handleAddOption);
        clearSelectionsButton.addEventListener("click", handleClearSelection);
        maxSelectionsInput.addEventListener("input", handleMaxSelectionsInput);
        decreaseCounterButton.addEventListener("click", handleMaxSelectionsDecrease);
        increaseCounterButton.addEventListener("click", handleMaxSelectionsIncrease);
        form.addEventListener("submit", handleFormSubmit);
    }

    function handleAddOption()
    {
        const optionText = newOptionInput.value.trim();

        if ( !optionText ) return;
    
        if ( Array.from(document.querySelectorAll(".option_text_span")).some(option => option.textContent.trim() === optionText) )
        {
            alert("The provided option is already added.");
            return;
        }
    
        addOption(optionText, optionsListElement);
        newOptionInput.value = "";
    }

    function handleClearSelection()
    {
        selectableElementsHandler.clearSelection();
        updateAnswerField();
    }

    function updateMaxSelection(value)
    {
        maxSelectionsInput.value = value;
        
        if ( !isNaN(value) && value > 0 )
        {
            selectableElementsHandler.setMaxSelections(value);
        }
    }

    function handleMaxSelectionsInput()
    {
        let value = Math.min(Math.max(parseInt(maxSelectionsInput.value) || 1, 1), 10);
        updateMaxSelection(value);
    }

    function handleMaxSelectionsDecrease()
    {
        let value = Math.max(parseInt(maxSelectionsInput.value) - 1, 1);
        updateMaxSelection(value);
    }

    function handleMaxSelectionsIncrease()
    {
        let value = Math.min(parseInt(maxSelectionsInput.value) + 1, 10);
        updateMaxSelection(value);
    }

    function handleFormSubmit()
    {
        updateHintsInput();
        updateOptionsField();
        updateAnswerField();
    }

    function addOption(optionText, container)
    {
        const optionTextSpan = document.createElement("span");
        optionTextSpan.classList.add("option_text_span");
        optionTextSpan.textContent = optionText;

        const removeOptionElementButton = document.createElement("button");
        removeOptionElementButton.type = "button";
        removeOptionElementButton.textContent = "X";
        removeOptionElementButton.classList.add("remove_option_element_btn");
        removeOptionElementButton.addEventListener("click", (e) => {
            e.stopPropagation();
            removeOption(optionText);
        });

        const removeOptionElementButtonSpan = document.createElement("span");
        removeOptionElementButtonSpan.classList.add("remove_option_element_button_span");
        removeOptionElementButtonSpan.appendChild(removeOptionElementButton);

        const optionSpan = document.createElement("span");
        optionSpan.classList.add("option_span");
        optionSpan.appendChild(optionTextSpan);
        optionSpan.appendChild(removeOptionElementButtonSpan);

        const optionContainer = document.createElement("div");
        optionContainer.appendChild(optionSpan);
        optionElementsContainer.appendChild(optionContainer);

        const listItem = document.createElement("div");
        listItem.classList.add("selectable");
        listItem.dataset.optionText = optionText;
        listItem.textContent = optionText;

        container.appendChild(listItem);
        selectableElementsHandler.addElement(listItem);

        updateOptionsField();
    }

    function removeOption(optionText)
    {
        Array.from(optionsListElement.children).forEach(element => {
            if ( element.textContent === optionText )
            {
                selectableElementsHandler.removeElement(element);
                element.remove();
            }
        });

        Array.from(optionElementsContainer.children).forEach(element => {
            if ( element.querySelector(".option_text_span").textContent === optionText )
            {
                element.remove();
            }
        });

        updateOptionsField();
    }

    function updateOptionsField()
    {
        const options = Array.from(optionsListElement.children).map(element => element.textContent);
        optionsInput.value = JSON.stringify(options);
    }

    function updateAnswerField()
    {
        answerInput.value = JSON.stringify(selectableElementsHandler.getSelectedElements());
    }
});

async function getSelectBasedTaskData()
{
    const selectBasedTaskId = parseInt(window.location.pathname.split('/').pop());

    if ( !Number.isInteger(selectBasedTaskId) )
    {
        throw new Error('Invalid select-based task ID');
    }

    const form = document.getElementById('select_based_task_update_form');

    if ( !form.action.endsWith(selectBasedTaskId.toString()) )
    {
        form.action += selectBasedTaskId;
    }

    const response = await getSelectBasedTaskById(selectBasedTaskId);

    if ( !response.success )
    {
        throw new Error('Failed to fetch select-based task');
    }

    return response.data;
}

async function loadSelectBasedTaskData(addOption)
{
    const selectBasedTask = await getSelectBasedTaskData();
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
        option.selected = taskDifficultyLevel.id == selectBasedTask.difficultyLevelId;
        dropdown.appendChild(option);
    });

    document.getElementById('content').value = selectBasedTask.content;
    document.getElementById('is_active').checked = selectBasedTask.isActive;

    JSON.parse(selectBasedTask.options).forEach(optionElement => {
        addOption(optionElement, document.getElementById("options_list"));
    });

    document.querySelectorAll(".selectable.selectable").forEach(optionElement => {
        if ( JSON.parse(selectBasedTask.answer).includes(optionElement.textContent) )
        {
            optionElement.classList.add("selected");
        }
    });

    hints = selectBasedTask.hints ? JSON.parse(selectBasedTask.hints) : [];
    constructHintElements("hints_content_container");
    renderHints();
}