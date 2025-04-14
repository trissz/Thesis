document.addEventListener('DOMContentLoaded', async function() {
    await loadTimeUnitData();
});

async function getTimeUnitData()
{
    const timeUnitId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(timeUnitId) )
    {
        const form = document.getElementById('time_unit_update_form');

        if ( !form.action.endsWith(timeUnitId.toString()) )
        {
            form.action += timeUnitId;
        }
        
        const response = await getTimeUnitById(timeUnitId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch time unit');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid time unit ID');
    }
}

async function loadTimeUnitData()
{
    const timeUnit = await getTimeUnitData();

    document.getElementById('name').value = timeUnit.name;
    document.getElementById('notation').value = timeUnit.notation;
    document.getElementById('seconds_equivalent').value = timeUnit.secondsEquivalent;
    document.getElementById('is_active').checked = timeUnit.isActive;
}