document.addEventListener('DOMContentLoaded', function() {
    loadModuleData();
});

async function getModuleData()
{
    const moduleId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(moduleId) )
    {
        const form = document.getElementById('module_update_form');

        if ( !form.action.endsWith(moduleId.toString()) )
        {
            form.action += moduleId;
        }
        
        const response = await getModuleById(moduleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch module');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid module ID');
    }
}

async function loadModuleData()
{
    const module = await getModuleData();

    document.getElementById('title').value = module.title;
    document.getElementById('description').value = module.description;
    document.getElementById('is_active').checked = module.isActive;
}