document.addEventListener('DOMContentLoaded', async () => {
    const sortBasedTask = await getSortBasedTaskData();
    const sortableListElement = document.getElementById('sortable_list');
    const answerInputElement = document.getElementById('answer');
    const hintsContainer = document.getElementById('hints_container');
    const moveCounterElement = document.getElementById('move_counter');
    const shuffleSortableListButton = document.getElementById('shuffle_sortable_list_btn');
    const giveNewHintButton = document.getElementById('give_new_hint_btn');
    const checkSolutionButton = document.getElementById('check_solution_btn');
    const solutionResultContainer = document.getElementById('solution_result_container');
    solutionResultContainer.classList.add('invisible');

    const sortableListHandler = SortableListHandler({
        list: sortableListElement,
        answerInput: answerInputElement,
        config: { editable: false, handleElements: false, displayElements: false, performOnUpdate: updateMoveCounter }
    });

    const taskHintProvider = new TaskHintProvider(JSON.parse(sortBasedTask.hints));

    await loadSortBasedTask();

    shuffleSortableListButton.addEventListener('click', async () => {
        sortableListHandler.shuffleList();
    });

    checkSolutionButton.addEventListener('click', async () => {
        sortableListHandler.updateSortedElements();

        solutionResultContainer.innerHTML = '';
        solutionResultContainer.classList.remove('invisible');

        const loadingSpinner = document.createElement('div');
        loadingSpinner.classList.add('loading_spinner');
        solutionResultContainer.appendChild(loadingSpinner);

        const response = await checkSortBasedTaskSolution();

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

    async function getSortBasedTaskData()
    {
        const sortBasedTaskId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(sortBasedTaskId) )
        {
            throw new Error('Sort based task ID is not an integer number');
        }

        const response = await getDetailedSortBasedTaskById(sortBasedTaskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch sort based task');
        }

        return response.data;
    }
    
    function updateMoveCounter()
    {
        moveCounterElement.textContent = sortableListHandler.getMoveCounter();
    }

    async function loadSortBasedTask()
    {
        document.getElementById('task_difficulty_level_name').textContent = sortBasedTask.taskDifficultyLevelName;
        document.getElementById('task_difficulty_level_badge').dataset.difficulty = sortBasedTask.taskDifficultyLevelName;
        document.getElementById('task_content').textContent = sortBasedTask.content;
        MessageSystem.append('info', 'Drag to sort', document.getElementById('sortable_section_info_container'), false);

        JSON.parse(sortBasedTask.elements).forEach(element => {
            sortableListHandler.addElement(element);
        });

        sortableListHandler.shuffleList();
        updateMoveCounter();
    }

    async function checkSortBasedTaskSolution()
    {    
        try {
            const response = await fetch(`/sort-based-task/check-solution/${sortBasedTask.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: answerInputElement.value }),
            });
    
            return response.json();
        } catch ( error ) {
            throw new Error(`Failed to check sort based task solution: ${error}`);
        }
    }
});