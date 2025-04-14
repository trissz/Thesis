class CustomEventsHelper
{
    static customEventNames = {
        taskElementsChange: "taskElementsChange",
        taskAnswerChange: "taskAnswerChange",
        counterInputChange: "counterInputChange"
    };

    static makeNewCustomEvent(customEventName, eventOptions = {})
    {
        return new CustomEvent(customEventName, eventOptions);
    }
}