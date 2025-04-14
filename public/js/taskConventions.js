let currentHandler = null;

function destroyCurrentHandler()
{
    if ( currentHandler )
    {
        currentHandler.destroy();
    }
}

function constructTaskConvention(taskType, actionMethod, parameters)
{
    switch ( taskType )
    {
        case taskTypes.SORT_BASED:
            makeSortableList(actionMethod, parameters);
        ;break;
        case taskTypes.SELECT_BASED:
            makeSelectableElements(actionMethod, parameters);
        ;break;
        case taskTypes.INPUT_BASED:
            makeInputElements(actionMethod, parameters);
        ;break;
    }
}

function makeSortableList(actionMethod, parameters)
{
    parameters.container.innerHTML = "";

    switch ( actionMethod )
    {
        case actionMethods.CREATE:
            destroyCurrentHandler();

            currentHandler = new SortableListHandler({
                container: parameters.container,
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });
        ;break;
        case actionMethods.UPDATE:
            destroyCurrentHandler();

            currentHandler = new SortableListHandler({
                container: parameters.container,
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });
        ;break;
        case actionMethods.VIEW:
            
        ;break;
    }
}

function makeSelectableElements(actionMethod, parameters)
{
    parameters.container.innerHTML = "";

    let increaseCounterButton;
    let decreaseCounterButton;
    let clearSelectionsButton;
    let counterInput;
    let counterSectionContainer;

    switch ( actionMethod )
    {
        case actionMethods.CREATE:
            destroyCurrentHandler();
            
            currentHandler = new SelectableElementsHandler({
                container: parameters.container,
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });

            increaseCounterButton = document.createElement("button");
            increaseCounterButton.setAttribute('id', "increase_counter_btn");
            increaseCounterButton.classList.add("counter_btn");
            increaseCounterButton.type = "button";
            increaseCounterButton.textContent = "+";

            decreaseCounterButton = document.createElement("button");
            decreaseCounterButton.setAttribute('id', "decrease_counter_btn");
            decreaseCounterButton.classList.add("counter_btn");
            decreaseCounterButton.type = "button";
            decreaseCounterButton.textContent = "-";

            clearSelectionsButton = document.createElement("button");
            clearSelectionsButton.setAttribute('id', "clear_selections_btn");
            clearSelectionsButton.type = "button";
            clearSelectionsButton.textContent = "cls";

            increaseCounterButton.addEventListener('click', () => {
                counterInput.value = `${parseInt(counterInput.value) + 1}`;
                counterInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.counterInputChange));
            });

            decreaseCounterButton.addEventListener('click', () => {
                if ( parseInt(counterInput.value) > selectBasedTaskDataset.defaultMinSelections )
                {
                    counterInput.value = `${parseInt(counterInput.value) - 1}`;
                    counterInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.counterInputChange));
                }
            });

            clearSelectionsButton.addEventListener('click', () => currentHandler.clearSelections());

            counterInput = document.createElement("input");
            counterInput.setAttribute('id', "counter_input");
            counterInput.type = "number";
            counterInput.value = `${selectBasedTaskDataset.defaultMinSelections}`;

            currentHandler.setMaxSelections(selectBasedTaskDataset.defaultMinSelections);

            counterInput.addEventListener(CustomEventsHelper.customEventNames.counterInputChange, (event) => {
                currentHandler.setMaxSelections(parseInt(event.target.value));
            });

            counterSectionContainer = document.createElement("div");
            counterSectionContainer.classList.add("counter_section_container");
            counterSectionContainer.appendChild(decreaseCounterButton);
            counterSectionContainer.appendChild(counterInput);
            counterSectionContainer.appendChild(increaseCounterButton);

            parameters.container.appendChild(clearSelectionsButton);
            parameters.container.appendChild(counterSectionContainer);
        ;break;
        case actionMethods.UPDATE:
            destroyCurrentHandler();
            
            currentHandler = new SelectableElementsHandler({
                container: parameters.container,
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });

            increaseCounterButton = document.createElement("button");
            increaseCounterButton.setAttribute('id', "increase_counter_btn");
            increaseCounterButton.classList.add("counter_btn");
            increaseCounterButton.type = "button";
            increaseCounterButton.textContent = "+";

            decreaseCounterButton = document.createElement("button");
            decreaseCounterButton.setAttribute('id', "decrease_counter_btn");
            decreaseCounterButton.classList.add("counter_btn");
            decreaseCounterButton.type = "button";
            decreaseCounterButton.textContent = "-";

            clearSelectionsButton = document.createElement("button");
            clearSelectionsButton.setAttribute('id', "clear_selections_btn");
            clearSelectionsButton.type = "button";
            clearSelectionsButton.textContent = "cls";

            increaseCounterButton.addEventListener('click', () => {
                counterInput.value = `${parseInt(counterInput.value) + 1}`;
                counterInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.counterInputChange));
            });

            decreaseCounterButton.addEventListener('click', () => {
                if ( parseInt(counterInput.value) > selectBasedTaskDataset.defaultMinSelections )
                {
                    counterInput.value = `${parseInt(counterInput.value) - 1}`;
                    counterInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.counterInputChange));
                }
            });

            clearSelectionsButton.addEventListener('click', () => currentHandler.clearSelections());

            counterInput = document.createElement("input");
            counterInput.setAttribute('id', "counter_input");
            counterInput.type = "number";
            counterInput.value = `${parameters.answerArray.length}`;

            currentHandler.setMaxSelections(parameters.answerArray.length);

            counterInput.addEventListener(CustomEventsHelper.customEventNames.counterInputChange, (event) => {
                currentHandler.setMaxSelections(parseInt(event.target.value));
            });

            counterSectionContainer = document.createElement("div");
            counterSectionContainer.classList.add("counter_section_container");
            counterSectionContainer.appendChild(decreaseCounterButton);
            counterSectionContainer.appendChild(counterInput);
            counterSectionContainer.appendChild(increaseCounterButton);

            parameters.container.appendChild(clearSelectionsButton);
            parameters.container.appendChild(counterSectionContainer);
        ;break;
        case actionMethods.VIEW:
            
        ;break;
    }
}

function makeInputElements(actionMethod, parameters)
{
    parameters.container.innerHTML = "";
    
    switch ( actionMethod )
    {
        case actionMethods.CREATE:
            destroyCurrentHandler();

            currentHandler = new InputElementsHandler({
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });

            MessageSystem.append('info', 'The answer will be any of the elements', parameters.container, false);
        ;break;
        case actionMethods.UPDATE:
            destroyCurrentHandler();

            currentHandler = new InputElementsHandler({
                elementsInput: parameters.elementsInput,
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: true,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });

            MessageSystem.append('info', 'The answer will be any of the elements', parameters.container, false);
        ;break;
        case actionMethods.VIEW:
            destroyCurrentHandler();

            currentHandler = new InputElementsHandler({
                answerInput: parameters.answerInput,
                elementsArray: parameters.elementsArray,
                answerArray: parameters.answerArray,
                config: parameters.config || {
                    handleElements: false,
                    handleAnswer: true,
                    performOnUpdate: () => {}
                }
            });

            parameters.container.innerHTML = `
                <div class="input_area">
                    <div class="area_header">
                        <span class="area_header_item section_info_container" id="input_section_info_container"></span>
                    </div>

                    <input type="text" id="input_answer" name="input_answer"/>
                </div>
            `;

            const inputAnswerElement = parameters.container.getElementById("input_answer");

            inputAnswerElement.addEventListener('input', () => {
                parameters.answerInput.value = JSON.stringify([inputAnswerElement.value]);
            });

            MessageSystem.append('info', 'Type in the answer', parameters.container, false);
        ;break;
    }
}