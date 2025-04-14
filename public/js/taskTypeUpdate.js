document.addEventListener('DOMContentLoaded', async () => {
    await loadTaskTypeData();
});

async function getTaskTypeData()
{
    const taskTypeId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(taskTypeId) )
    {
        const form = document.getElementById('task_type_update_form');

        if ( !form.action.endsWith(taskTypeId.toString()) )
        {
            form.action += taskTypeId;
        }
        
        const response = await getTaskTypeById(taskTypeId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch task type');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid task type ID');
    }
}

async function loadTaskTypeData()
{
    const taskType = await getTaskTypeData();

    document.getElementById('name').value = taskType.name;
    document.getElementById('is_active').checked = taskType.isActive;
}