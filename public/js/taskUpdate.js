document.addEventListener('DOMContentLoaded', async () => {
    const task = await getTaskData();
    const form = document.getElementById('task_update_form');
    const typeDropdown = document.getElementById('type_id');
    const difficultyLevelDropdown = document.getElementById('difficulty_level_id');
    const contentElement = document.getElementById('content');
    const newElementInput = document.getElementById('new_element');
    const addElementButton = document.getElementById('add_element_btn');
    const elementsContainer = document.getElementById('elements_container');
    const elementsElement = document.getElementById('elements');
    const taskConventionContainer = document.getElementById('task_convention_container');
    const answerElement = document.getElementById('answer');
    const hintsContentContainer = document.getElementById('hints_content_container');
    const hintsElement = document.getElementById('hints');
    let elementsArray = [];
    let answerArray = [];

    const taskHintManager = new TaskHintManager({
        container: hintsContentContainer,
        hintsInputElement: hintsElement
    });

    initializeEventListeners();

    await loadTaskTypes();
    await loadTaskDifficultyLevels();
    await loadTaskData();

    handleTaskConvention();

    function initializeEventListeners()
    {
        addElementButton.addEventListener("click", handleAddElement);
        typeDropdown.addEventListener("change", handleTaskConvention);
        answerElement.addEventListener(CustomEventsHelper.customEventNames.taskAnswerChange, syncAnswerInputValueWithAnswerArray);
    }

    async function getTaskTypeData(taskTypeId)
    {
        if ( Number.isInteger(taskTypeId) )
        {
            const response = await getTaskTypeById(taskTypeId);
    
            if ( !response.success )
            {
                throw new Error('Failed to fetch task type');
            }
    
            return response.data;
        }
        else
        {
            throw new Error('Invalid task type ID');
        }
    }

    async function getTaskTypesData()
    {
        const response = await getTaskTypesAll();

        if ( !response.success )
        {
            throw new Error('Failed to fetch task types');
        }
        
        return response.data;
    }

    async function getTaskDifficultyLevelsData()
    {
        const response = await getTaskDifficultyLevelsAll();

        if ( !response.success )
        {
            throw new Error('Failed to fetch task difficulty levels');
        }
        
        return response.data;
    }

    async function getTaskData()
    {
        const taskId = parseInt(window.location.pathname.split('/').pop());

        if ( Number.isInteger(taskId) )
        {
            const form = document.getElementById('task_update_form');

            if ( !form.action.endsWith(taskId.toString()) )
            {
                form.action += taskId;
            }

            const response = await getTaskById(taskId);

            if ( !response.success )
            {
                throw new Error('Failed to fetch detailed task');
            }

            return response.data;
        }
        else
        {
            throw new Error('Invalid task ID');
        }
    }

    async function loadTaskTypes()
    {
        const taskTypes = await getTaskTypesData();
        typeDropdown.innerHTML = '';

        if ( taskTypes.length === 0 )
        {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No task types found';
            option.disabled = true;
            option.selected = true;
            typeDropdown.appendChild(option);
            return;
        }

        taskTypes.forEach(taskType => {
            const option = document.createElement('option');
            option.value = taskType.id;
            option.textContent = taskType.name;
            typeDropdown.appendChild(option);
        });
    }

    async function loadTaskDifficultyLevels()
    {
        const taskDifficultyLevels = await getTaskDifficultyLevelsData();
        difficultyLevelDropdown.innerHTML = '';

        if ( taskDifficultyLevels.length === 0 )
        {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No task difficulty levels found';
            option.disabled = true;
            option.selected = true;
            difficultyLevelDropdown.appendChild(option);
            return;
        }

        taskDifficultyLevels.forEach(taskDifficultyLevel => {
            const option = document.createElement('option');
            option.value = taskDifficultyLevel.id;
            option.textContent = taskDifficultyLevel.name;
            difficultyLevelDropdown.appendChild(option);
        });
    }

    async function loadTaskData()
    {
        Array.from(typeDropdown.options).forEach(option => {
            if ( parseInt(option.value) === task.typeId )
            {
                option.selected = true;
            }
        });
    
        Array.from(difficultyLevelDropdown.options).forEach(option => {
            if ( parseInt(option.value) === task.difficultyLevelId )
            {
                option.selected = true;
            }
        });

        resetTaskElements();
        resetTaskAnswer();
        handleUpdate();

        taskHintManager.constructHintElements();
        taskHintManager.hints = task.hints ? JSON.parse(task.hints) : [];
        taskHintManager.updateHintsInputElement();
        taskHintManager.renderHints();
    
        contentElement.value = task.content || '';
        document.getElementById('is_active').checked = task.isActive;
    }

    function handleAddElement()
    {
        const elementValue = newElementInput.value;

        if (  !elementValue || elementValue == '' )
        {
            alert("Element input can not be empty");
            return;
        }

        if ( elementsArray.includes(elementValue) )
        {
            alert(`The element "${elementValue}" is already added to the elements`);
            return;
        }

        addElement(elementValue);
        handleUpdate();
    }

    function normalizeAnswerAfterElementRemove()
    {
        for ( let i = answerArray.length - 1; i >= 0; i -- )
        {
            if ( !elementsArray.includes(answerArray[i]) )
            {
                answerArray.splice(i, 1);
            }
        }
    }

    function handleRemoveElement(elementValue)
    {
        if (  !elementValue || elementValue == '' )
        {
            alert("Can not remove empty element");
            return;
        }

        removeElement(elementValue);
        normalizeAnswerAfterElementRemove();
        handleUpdate();
    }

    async function handleTaskConvention()
    {
        resetTaskElements();
        resetTaskAnswer();
        handleUpdate();

        const taskConventionParameters = {
            container: taskConventionContainer,
            elementsInput: elementsElement,
            answerInput: answerElement,
            elementsArray: elementsArray,
            answerArray: answerArray,
            config: {
                handleElements: true,
                handleAnswer: true,
            }
        };

        const taskType = await getTaskTypeData(parseInt(typeDropdown.value));
        constructTaskConvention(taskType.name, actionMethods.UPDATE, taskConventionParameters);
    }

    function addElement(elementValue)
    {
        elementsArray.push(elementValue);
    }

    function removeElement(elementValue)
    {
        if ( elementsArray.includes(elementValue) )
        {
            for ( let i = elementsArray.length - 1; i >= 0; i -- )
            {
                if ( elementsArray[i] === elementValue )
                {
                    elementsArray.splice(i, 1);
                }
            }
        }
    }

    function createElement(newElementValue)
    {
        const elementTextContainer = document.createElement("span");
        elementTextContainer.classList.add("element_text_container");
        elementTextContainer.textContent = newElementValue;

        const removeElementButton = document.createElement("button");
        removeElementButton.type = "button";
        removeElementButton.textContent = "X";
        removeElementButton.classList.add("remove_element_btn");
        removeElementButton.addEventListener("click", (event) => {
            event.stopPropagation();
            handleRemoveElement(newElementValue);
        });

        const removeElementButtonContainer = document.createElement("span");
        removeElementButtonContainer.classList.add("remove_element_btn_container");
        removeElementButtonContainer.appendChild(removeElementButton);

        const elementItemContainer = document.createElement("span");
        elementItemContainer.classList.add("element_item_container");
        elementItemContainer.dataset.textContent = newElementValue;
        elementItemContainer.appendChild(elementTextContainer);
        elementItemContainer.appendChild(removeElementButtonContainer);

        let elementContainer = document.createElement("div");
        elementContainer.classList.add("element_container");
        elementContainer.appendChild(elementItemContainer);
        elementsContainer.appendChild(elementContainer);
    }

    function deleteElement(toDeleteElementValue)
    {
        if ( elementsArray.includes(toDeleteElementValue) )
        {
            for ( let i = elementsArray.length - 1; i >= 0; i -- )
            {
                if ( elementsArray[i] === toDeleteElementValue )
                {
                    elementsArray.splice(i, 1);
                }
            }
        }
    }

    function resetTaskElements()
    {
        elementsArray = JSON.parse(task.elements);
    }

    function resetTaskAnswer()
    {
        answerArray = JSON.parse(task.answer);
    }

    function syncElementsInputValueWithElementsArray()
    {
        elementsElement.value = JSON.stringify(elementsArray);
    }

    function syncAnswerInputValueWithAnswerArray()
    {
        answerElement.value = JSON.stringify(answerArray);
    }

    function handleElementsUpdate()
    {
        syncElementsInputValueWithElementsArray();
        elementsElement.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskElementsChange));
        renderElements();
    }

    function handleAnswerUpdate()
    {
        syncAnswerInputValueWithAnswerArray();
        answerElement.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskAnswerChange));
    }

    function handleUpdate()
    {
        handleElementsUpdate();
        handleAnswerUpdate();
    }

    function renderElements()
    {
        elementsContainer.innerHTML = '';

        elementsArray.forEach(element => {
            createElement(element);
        });
    }
});