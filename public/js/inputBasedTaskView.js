document.addEventListener('DOMContentLoaded', async () => {
    const inputBasedTask = await getInputBasedTaskData();
    const answerInputElement = document.getElementById('answer');
    const hintsContainer = document.getElementById('hints_container');
    const giveNewHintButton = document.getElementById('give_new_hint_btn');
    const checkSolutionButton = document.getElementById('check_solution_btn');
    const solutionResultContainer = document.getElementById('solution_result_container');
    const taskHintProvider = new TaskHintProvider(JSON.parse(inputBasedTask.hints));

    await loadInputBasedTask();

    checkSolutionButton.addEventListener('click', async () => {
        solutionResultContainer.innerHTML = '';

        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = "Checking solution...";
        solutionResultContainer.appendChild(paragraphElement);

        const response = await checkInputBasedTaskSolution();

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

    async function getInputBasedTaskData()
    {
        const inputBasedTaskId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(inputBasedTaskId) )
        {
            throw new Error('Input based task ID is not an integer number');
        }

        const response = await getDetailedInputBasedTaskById(inputBasedTaskId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch input based task');
        }

        return response.data;
    }

    async function loadInputBasedTask()
    {
        document.getElementById('task_difficulty_level_name').textContent = inputBasedTask.taskDifficultyLevelName;
        document.getElementById('task_content').textContent = inputBasedTask.content;
        MessageSystem.append('info', 'Type in the answer below', document.getElementById('input_section_info_container'), false);
    }

    async function checkInputBasedTaskSolution()
    {    
        try {
            const response = await fetch(`/input-based-task/check-solution/${inputBasedTask.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: answerInputElement.value }),
            });
    
            return response.json();
        } catch ( error ) {
            throw new Error(`Failed to check input based task solution: ${error}`);
        }
    }
});