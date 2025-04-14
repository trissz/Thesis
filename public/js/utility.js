class Utility
{
    static getElementWidth(element)
    {
        return (
            element.clientWidth -
            parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-left")) -
            parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-right"))
        )
    }
  
    static getElementHeight(element)
    {
        return (
            element.clientHeight -
            parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-top")) -
            parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-bottom"))
        )
    }

    static getLowestSquare(number)
    {
        return Math.floor(Math.sqrt(number));
    }

    static removeDuplicatesFromArray(arr)
    {
        arr = Array.from(new Set(arr));
    }

    static removeFirstOccurenceFromArray(arr, value)
    {
        var index = arr.indexOf(value);

        if ( index > -1 )
        {
            arr.splice(index, 1);
        }

        return arr;
    }

    static removeAllOccurencesFromArray(arr, value)
    {
        let i = 0;

        while ( i < arr.length )
        {
            if ( arr[i] === value )
            {
                arr.splice(i, 1);
            }
            else
            {
                i ++;
            }
        }

        return arr;
    }

    static swapArrayElements(arr, i, j)
    {
        const val = arr[i];
        arr[i] = arr[j];
        arr[j] = val;
    }

    static shuffleArray(arr)
    {
        for ( let i = arr.length - 1; i > 0; i -- )
        {
            const j = Math.floor(Math.random() * ( i + 1 ));
            swapArrayElements(arr, j, i);
        }
    }
}