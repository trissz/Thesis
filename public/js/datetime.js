const TIME_UNITS = new Map([
    ['year', 31536000],   // 365 days
    ['month', 2592000],    // 30 days (approximation)
    ['week', 604800],      // 7 days
    ['day', 86400],        // 24 hours
    ['hour', 3600],        // 60 minutes
    ['minute', 60],
    ['second', 1]
]);

function formatDate(dateString)
{
    try {
        const date = new Date(dateString);
        if ( isNaN(date) ) return 'Invalid date';
        
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
        }).format(date);
    } catch ( error ) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
    }
}

function formatTimeAgo(dateString)
{
    const date = new Date(dateString);
    const now = new Date();
    
    if ( isNaN(date) ) return 'Invalid date';
    
    const seconds = Math.round(( now - date ) / 1000);
    const absSeconds = Math.abs(seconds);

    if ( absSeconds < 10 ) return 'Just now';
    if ( absSeconds < 60 ) return `${absSeconds} seconds ago`;

    for ( const [unit, secondsInUnit] of TIME_UNITS )
    {
        const interval = Math.floor(absSeconds / secondsInUnit);

        if ( interval >= 1 )
        {
            const plural = interval !== 1 ? 's' : '';
            return seconds < 0 ? `In ${interval} ${unit}${plural}` : `${interval} ${unit}${plural} ago`;
        }
    }
    
    return formatDate(dateString);
}

function formatTotalTime(seconds)
{
    if ( seconds <= 0 ) return '0 seconds';

    if ( !Number.isInteger(seconds) )
    {
        console.warn('Non-integer seconds value:', seconds);
        seconds = Math.round(seconds);
    }

    const parts = [];
    let remaining = seconds;

    for ( const [unit, secondsInUnit] of TIME_UNITS )
    {
        if ( remaining <= 0 ) break;
        
        const count = Math.floor(remaining / secondsInUnit);
        
        if ( count > 0 )
        {
            parts.push(`${count} ${unit}${count !== 1 ? 's' : ''}`);
            remaining -= count * secondsInUnit;
        }
    }

    const significantParts = parts.slice(0, 2); 
    return significantParts.join(' ') || '0 seconds';
}