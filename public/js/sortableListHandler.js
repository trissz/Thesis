class SortableListHandler
{
    constructor (parameters)
    {
        this.container = parameters.container;
        this.sortableList;
        this.elementsInput = parameters.elementsInput;
        this.answerInput = parameters.answerInput;
        this.elementsArray = parameters.elementsArray || [];
        this.answerArray = parameters.answerArray || [];
        this.config = parameters.config || {
            handleElements: true,
            handleAnswer: true,
            performOnUpdate: () => {}
        };

        this.moveCounter = 0;
        this.sortableInstance = null;

        if ( this.config.handleElements )
        {
            this.boundHandleElementsUpdate = this.handleElementsUpdate.bind(this);
        }

        this.initialize();
    }

    initialize()
    {
        this.sortableList = document.createElement("ul");
        this.sortableList.classList.add('sortable_list');
        this.container.appendChild(this.sortableList);
        
        this.sortableInstance = new Sortable(this.sortableList, {
            animation: 150,
            ghostClass: "sortable-ghost",
            onEnd: () => this.handleSortEnd(),
            onUpdate: () => this.handleSortUpdate()
        });

        this.renderSortedList();

        if ( this.config.handleElements )
        {
            this.elementsInput.addEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }
    }

    getMoveCounter()
    {
        return this.moveCounter;
    }

    setMoveCounter(newMoveCounter)
    {
        if ( Number.isInteger(newMoveCounter) && newMoveCounter >= 0 )
        {
            this.moveCounter = newMoveCounter;
        }
    }

    getSortableListItemValues()
    {
        return Array.from(this.sortableList.children).map(listItem => listItem.dataset.value);
    }

    syncAnswerArrayWithElementsArray()
    {
        this.answerArray.length = 0;

        for ( let i = 0; i < this.elementsArray.length; i ++ )
        {
            this.answerArray.push(this.elementsArray[i]);
        }
    }

    syncAnswerArrayWithSortableListItemValues()
    {
        const sortableListItemValues = this.getSortableListItemValues();
        this.answerArray.length = 0;

        for ( let i = 0; i < sortableListItemValues.length; i ++ )
        {
            this.answerArray.push(sortableListItemValues[i]);
        }
    }

    handleSortEnd()
    {
        this.sortableInstance.save();
        this.syncAnswerArrayWithSortableListItemValues();
        this.answerInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskAnswerChange));
    }

    handleSortUpdate()
    {
        this.moveCounter ++;
        this.config.performOnUpdate();
    }

    handleElementsUpdate()
    {
        this.syncAnswerArrayWithElementsArray();
        this.renderList();
    }

    renderList()
    {
        this.sortableList.innerHTML = '';

        this.elementsArray.forEach(element => {
            this.sortableList.appendChild(this.createSortableListItem(element));
        });
    }

    renderSortedList()
    {
        this.sortableList.innerHTML = '';

        this.answerArray.forEach(element => {
            this.sortableList.appendChild(this.createSortableListItem(element));
        });
    }

    addSortableElement(newSortableElementValue)
    {
        this.elementsArray.push(newSortableElementValue);
        const listItem = this.createSortableListItem(newSortableElementValue);
        this.sortableList.appendChild(listItem);
    }

    removeSortableElement(toRemoveSortableElementValue)
    {
        if ( this.elementsArray.includes(toRemoveSortableElementValue) )
        {
            for ( let i = this.elementsArray.length - 1; i >= 0; i -- )
            {
                if ( this.elementsArray[i] === toRemoveSortableElementValue )
                {
                    this.elementsArray.splice(i, 1);
                }
            }

            this.deleteListItem(toRemoveSortableElementValue);
        }
    }

    createSortableListItem(newSortableElementValue)
    {
        const listItem = document.createElement("li");
        listItem.classList.add("sortable_list_item");
        listItem.dataset.value = newSortableElementValue;
        listItem.textContent = newSortableElementValue;
        return listItem;
    }

    deleteSortableListItem(toDeleteSortableElementValue)
    {
        if ( this.elementsArray.includes(toDeleteSortableElementValue) )
        {
            for ( let i = this.elementsArray.length - 1; i >= 0; i -- )
            {
                if ( this.elementsArray[i] === toDeleteSortableElementValue )
                {
                    this.elementsArray.splice(i, 1);
                }
            }
        }
    }

    shuffleList()
    {
        Utility.shuffleArray(this.answerArray);
        this.answerInput.dispatchEvent(CustomEventsHelper.makeNewCustomEvent(CustomEventsHelper.customEventNames.taskAnswerChange));
        this.renderList();
    }

    destroy()
    {
        if ( this.config.handleElements )
        {
            this.elementsInput.removeEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }

        if ( this.sortableInstance )
        {
            this.sortableInstance.destroy();
        }

        this.sortableList.innerHTML = '';

        if ( this.elementsInput ) this.elementsInput.value = '';
        if ( this.answerInput ) this.answerInput.value = '';

        this.moveCounter = 0;
    }
}