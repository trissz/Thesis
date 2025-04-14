class TaskHintProvider
{
    constructor(hints = [])
    {
        this._hints = hints;
        this._hintIterator = 0;
    }

    get hints()
    {
        return this._hints;
    }

    set hints(newHints)
    {
        if ( Array.isArray(newHints) )
        {
            this._hints = newHints;
        }
    }

    get hintIterator()
    {
        return this._hintIterator;
    }

    set hintIterator(newHintIterator)
    {
        if ( Number.isInteger(newHintIterator) )
        {
            this._hintIterator = newHintIterator;
        }
    }

    getRandomHint()
    {
        return this._hints[Math.floor(Math.random() * this._hints.length)];
    }

    getNextHint()
    {
        if ( this._hintIterator < this._hints.length )
        {
            return this._hints[this._hintIterator++];
        }

        return "";
    }

    resetHintIterator()
    {
        this._hintIterator = 0;
    }
}