document.addEventListener('DOMContentLoaded', async () => {
    const task = await getTaskData();
    const container = document.getElementById('task_view_container');
    const taskConventionContainer = document.getElementById('task_convention_container');
    const answerElement = document.getElementById('answer');
    const hintsContainer = document.getElementById('hints_container');
    const giveNewHintButton = document.getElementById('give_new_hint_btn');
    const checkSolutionButton = document.getElementById('check_solution_btn');

    const sortableListElement = document.getElementById('sortable_list');
    const moveCounterElement = document.getElementById('move_counter');
    const shuffleSortableListButton = document.getElementById('shuffle_sortable_list_btn');

    const solutionResultContainer = document.getElementById('solution_result_container');
    solutionResultContainer.classList.add('invisible');
    const elementsArray = JSON.parse(task.elements);
    const answerArray = [];

    const taskHintProvider = new TaskHintProvider(JSON.parse(task.hints));

    await loadTask();

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

    async function getTaskData()
    {
        const taskId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(taskId) )
        {
            throw new Error('Task ID is not an integer number');
        }

        const response = await getDetailedTaskById(taskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch task');
        }

        return response.data;
    }

    async function loadTask()
    {
        document.getElementById('content').textContent = task.content;
        document.getElementById('task_difficulty_level_name').textContent = task.taskDifficultyLevelName;

        const taskConventionParameters = {
            container: taskConventionContainer,
            answerInput: answerElement,
            elementsArray: elementsArray,
            answerArray: answerArray,
            config: {
                handleElements: false,
                handleAnswer: true,
            }
        };

        constructTaskConvention(task.taskTypeName, actionMethods.VIEW, taskConventionParameters);
    }

    async function checkTaskSolution()
    {    
        try {
            const response = await fetch(`/task/check-solution/${task.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: answerInputElement.value }),
            });

            return response.json();
        } catch ( error ) {
            throw new Error(`Failed to task solution: ${error}`);
        }
    }
});