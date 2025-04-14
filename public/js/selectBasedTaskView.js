document.addEventListener('DOMContentLoaded', async () => {
    const selectBasedTask = await getSelectBasedTaskData();
    const optionsListElement = document.getElementById('options_list');
    const answerInputElement = document.getElementById('answer');
    const hintsContainer = document.getElementById('hints_container');
    const shuffleSelectableListButton = document.getElementById('shuffle_selectable_list_btn');
    const giveNewHintButton = document.getElementById('give_new_hint_btn');
    const checkSolutionButton = document.getElementById('check_solution_btn');
    const solutionResultContainer = document.getElementById('solution_result_container');
    const selectableElementsHandler = SelectableElementsHandler([], JSON.parse(selectBasedTask.answer).length);
    const taskHintProvider = new TaskHintProvider(JSON.parse(selectBasedTask.hints));
    solutionResultContainer.classList.add('invisible');

    await loadSelectBasedTask();

    shuffleSelectableListButton.addEventListener('click', async () => {
        shuffleOptionsList();
    });

    checkSolutionButton.addEventListener('click', async () => {
        updateAnswerField();

        solutionResultContainer.innerHTML = '';
        solutionResultContainer.classList.remove('invisible');

        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = "Checking solution...";
        solutionResultContainer.appendChild(paragraphElement);

        const response = await checkSelectBasedTaskSolution();

        if ( !response.success )
        {
            throw new Error('Failed to fetch solution');
        }

        solutionResultContainer.innerHTML = '';

        if ( response.isSolutionCorrect )
        {
            const correctAnswerParagraphElement = document.createElement('p');
            correctAnswerParagraphElement.classList.add('correct_answer');
            correctAnswerParagraphElement.textContent = "The answer is correct!";
            solutionResultContainer.appendChild(correctAnswerParagraphElement);
        }
        else
        {
            const correctAnswerParagraphElement = document.createElement('p');
            correctAnswerParagraphElement.classList.add('incorrect_answer');
            correctAnswerParagraphElement.textContent = "The answer is incorrect!";
            solutionResultContainer.appendChild(correctAnswerParagraphElement);
        }
    });

    giveNewHintButton.addEventListener('click', async () => {
        if ( taskHintProvider.hintIterator < taskHintProvider.hints.length )
        {
            const hintText = taskHintProvider.getNextHint();
            const hintSpan = document.createElement('span');
            hintSpan.classList.add('hint_item');
            hintSpan.textContent = hintText;
            hintsContainer.appendChild(hintSpan);
        }
        else
        {
            alert("There is no more available hints for this task...");
        }
    });

    function addOption(optionText, container)
    {
        const listItem = document.createElement("div");
        listItem.classList.add("selectable");
        listItem.dataset.optionText = optionText;
        listItem.textContent = optionText;

        selectableElementsHandler.addElement(listItem);
        container.appendChild(listItem);
    }

    function updateAnswerField()
    {
        answerInputElement.value = JSON.stringify(selectableElementsHandler.getSelectedElements());
    }

    async function getSelectBasedTaskData()
    {
        const selectBasedTaskId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(selectBasedTaskId) )
        {
            throw new Error('Select based task ID is not an integer number');
        }

        const response = await getDetailedSelectBasedTaskById(selectBasedTaskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch select based task');
        }
        
        return response.data;
    }

    async function loadSelectBasedTask()
    {
        document.getElementById('task_difficulty_level_name').textContent = selectBasedTask.taskDifficultyLevelName;
        document.getElementById('task_difficulty_level_badge').dataset.difficulty = selectBasedTask.taskDifficultyLevelName;
        document.getElementById('task_content').textContent = selectBasedTask.content;
        document.getElementById('max_selections').textContent = selectableElementsHandler.getMaxSelections();
        MessageSystem.append('info', 'Click to select elements', document.getElementById('selectable_section_info_container'), false);

        JSON.parse(selectBasedTask.options).forEach(option => {
            addOption(option, optionsListElement);
        });

        //normalizeGridLayout();
    }

    function normalizeGridLayout()
    {
        const selectableListItems = Array.from(document.querySelectorAll('.selectable'));
        const lowestSquare = Utility.getLowestSquare(selectableListItems.length);
        const topBox = document.createElement('div');
        topBox.style.display = 'grid';
        topBox.style.gridTemplateColumns = `repeat(${lowestSquare + 1}, 1fr)`;
        const bottomBox = document.createElement('div');
        bottomBox.style.display = 'grid';
        bottomBox.style.gridTemplateColumns = `repeat(${selectableListItems.length - Math.pow(lowestSquare + 1, 2)}, 1fr)`;
        optionsListElement.innerHTML = '';

        for ( let i = 0; i < Math.pow(lowestSquare, 2) && i < selectableListItems.length; i ++ )
        {
            const gridCell = document.createElement('div');
            addOption(selectableListItems[i].dataset.optionText, gridCell);
            topBox.appendChild(gridCell);
        }

        for ( let i = Math.min(Math.pow(lowestSquare, 2), selectableListItems.length); i < selectableListItems.length; i ++ )
        {
            addOption(selectableListItems[i].dataset.optionText, bottomBox);
        }

        optionsListElement.appendChild(topBox);
        optionsListElement.appendChild(bottomBox);
    }

    function shuffleOptionsList()
    {
        const selectableListItems = Array.from(document.querySelectorAll('.selectable'));
        
        for ( let i = selectableListItems.length - 1; i > 0; i -- )
        {
            const j = Math.floor(Math.random() * ( i + 1 ));
            optionsListElement.insertBefore(selectableListItems[j], selectableListItems[i]);
        }
    }

    async function checkSelectBasedTaskSolution()
    {    
        try {
            const response = await fetch(`/select-based-task/check-solution/${selectBasedTask.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: answerInputElement.value }),
            });
    
            return response.json();
        } catch ( error ) {
            throw new Error(`Failed to check select based task solution: ${error}`);
        }
    }
});