class TaskHandler
{
    constructor (options)
    {
        this.container = options.container;
        this.sortableList;
        this.elementsInput = options.elementsInput;
        this.answerInput = options.answerInput;
        this.config = options.config || {
            handleElements: true,
            handleAnswer: true,
            performOnUpdate: () => {}
        };
    }

    //getter setter
}