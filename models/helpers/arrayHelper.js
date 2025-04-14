class ArrayHelper
{
    static mergeUnique(...arrays)
    {
        return Array.from(new Set(arrays.flat()));
    }

    static arraysEqual(a, b)
    {
        if ( a.length !== b.length ) return false;

        for ( let i = 0; i < a.length; i ++ )
        {
            if ( a[i] !== b[i] ) return false;
        }

        return true;
    }

    static arraysIdentical(a, b)
    {
        if ( a.length !== b.length ) return false;

        for ( let i = 0; i < a.length; i ++ )
        {
            if ( !b.includes(a[i]) ) return false;
        }

        return true;
    }

    static swap(a, i, j)
    {
        //[a[i], a[j]] = [a[j], a[i]];

        let element = a[i];
        a[i] = a[j];
        a[j] = element;
    }

    static shuffle(a)
    {
        for ( let i = a.length - 1; i > 0; i -- )
        {
            const j = Math.floor(Math.random() * ( i + 1 ) );
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

module.exports = ArrayHelper;