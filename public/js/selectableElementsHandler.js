class SelectableElementsHandler
{
    constructor (parameters)
    {
        this.container = parameters.container;
        this.selectableElementsContainer;
        this.elementsInput = parameters.elementsInput;
        this.answerInput = parameters.answerInput;
        this.elementsArray = parameters.elementsArray || [];
        this.answerArray = parameters.answerArray || [];
        this.config = parameters.config || {
            handleElements: true,
            handleAnswer: true,
            performOnUpdate: () => {}
        };

        this.maxSelections = this.config?.maxSelections || selectBasedTaskDataset.defaultMaxSelections;

        if ( this.config.handleElements )
        {
            this.boundHandleElementsUpdate = this.handleElementsUpdate.bind(this);
        }

        this.initialize();
    }

    initialize()
    {
        this.selectableElementsContainer = document.createElement("div");
        this.selectableElementsContainer.classList.add('selectable_elements_container');
        this.container.appendChild(this.selectableElementsContainer);
        this.handleElementsUpdate();

        if ( this.config.handleElements )
        {
            this.elementsInput.addEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }
    }

    getSelectableElements()
    {
        return this.selectableElementsContainer.querySelectorAll('.selectable');
    }

    getSelectableElementValues()
    {
        return Array.from(this.selectableElementsContainer.querySelectorAll('.selectable')).map(selectableElement => selectableElement.dataset.value);
    }

    getSelectedElements()
    {
        return this.selectableElementsContainer.querySelectorAll('.selected');
    }

    getSelectedElementValues()
    {
        return Array.from(this.selectableElementsContainer.querySelectorAll('.selected')).map(selectedElement => selectedElement.dataset.value);
    }

    getMaxSelections()
    {
        return this.maxSelections;
    }

    setMaxSelections(newMaxSelection)
    {
        this.maxSelections = Math.max(selectBasedTaskDataset.defaultMinSelections, newMaxSelection);

        if ( this.answerArray.length > this.maxSelections )
        {
            this.clearSelections();
            this.renderSelectableElements();
        }
    }

    handleElementsUpdate()
    {
        this.renderSelectableElements();
    }

    toggleSelected(elementValue)
    {
        if ( this.elementsArray.includes(elementValue) )
        {
            if ( this.answerArray.includes(elementValue) )
            {
                Utility.removeAllOccurencesFromArray(this.answerArray, elementValue);
            }
            else if ( this.answerArray.length < this.maxSelections )
            {
                this.answerArray.push(elementValue);
            }
            
            this.answerInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskAnswerChange));
        }

        this.renderSelectableElements();
    }

    addSelectableElement(newSelectableElementValue)
    {
        const newSelectableElement = this.createSelectableElement(newSelectableElementValue);
        this.selectableElementsContainer.appendChild(newSelectableElement);
    }

    removeSelectableElement(toRemoveSelectableElementValue)
    {
        if ( this.elementsArray.includes(toRemoveSelectableElementValue) )
        {
            for ( let i = this.elementsArray.length - 1; i >= 0; i -- )
            {
                if ( this.elementsArray[i] === toRemoveSelectableElementValue )
                {
                    this.elementsArray.splice(i, 1);
                }
            }

            this.deleteSelectableElement(toRemoveSelectableElementValue);
        }
    }

    createSelectableElement(newSelectableElementValue)
    {
        const newSelectableElement = document.createElement('div');
        newSelectableElement.className = 'selectable';
        newSelectableElement.textContent = newSelectableElementValue;
        newSelectableElement.dataset.value = newSelectableElementValue;
        newSelectableElement.addEventListener('click', () => this.toggleSelected(newSelectableElement.dataset.value));
        return newSelectableElement;
    }

    deleteSelectableElement(toDeleteSelectableElementValue)
    {
        if ( this.elementsArray.includes(toDeleteSelectableElementValue) )
        {
            for ( let i = this.elementsArray.length - 1; i >= 0; i -- )
            {
                if ( this.elementsArray[i] === toDeleteSelectableElementValue )
                {
                    this.elementsArray.splice(i, 1);
                }
            }
        }
    }

    clearSelections()
    {
        this.answerArray.length = 0;
        this.renderSelectableElements();
        this.answerInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskAnswerChange));
    }

    renderSelectableElements()
    {
        this.selectableElementsContainer.innerHTML = '';

        this.elementsArray.forEach(element => {
            this.addSelectableElement(element);
        });

        const selectableElements = this.selectableElementsContainer.getElementsByClassName("selectable");

        for ( let selectableElement of selectableElements )
        {
            if ( this.answerArray.includes(selectableElement.dataset.value) )
            {
                selectableElement.classList.add('selected');
            }
        }
    }

    destroy()
    {
        if ( this.config.handleElements )
        {
            this.elementsInput.removeEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }
        
        this.selectableElementsContainer.innerHTML = '';
        this.maxSelections = 1;
    }
}