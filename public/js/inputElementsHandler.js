class InputElementsHandler
{
    constructor (parameters)
    {
        this.elementsInput = parameters.elementsInput;
        this.answerInput = parameters.answerInput;
        this.elementsArray = parameters.elementsArray;
        this.answerArray = parameters.answerArray;
        this.config = parameters.config || {
            handleElements: true,
            handleAnswer: true,
            performOnUpdate: () => {}
        };

        if ( this.config.handleElements )
        {
            this.boundHandleElementsUpdate = this.handleElementsUpdate.bind(this);
        }
        
        this.initialize();
    }

    initialize()
    {
        if ( this.config.handleElements )
        {
            this.elementsInput.addEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }
    }

    syncAnswerArrayWithElementsArray()
    {
        this.answerArray.length = 0;

        for ( let i = 0; i < this.elementsArray.length; i ++ )
        {
            this.answerArray.push(this.elementsArray[i]);
        }
    }

    handleElementsUpdate()
    {
        this.syncAnswerArrayWithElementsArray();
        this.config.performOnUpdate?.();
    }

    destroy()
    {
        if ( this.config.handleElements )
        {
            this.elementsInput.removeEventListener(CustomEventsHelper.customEventNames.taskElementsChange, this.boundHandleElementsUpdate);
        }
        
        this.inputElementsArray = [];
    }
}