document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadModules(),
        loadTimeUnits()
    ]);
});

async function loadModules()
{
    const response = await getModulesAll();
    const modules = response.data;
    const dropdown = document.getElementById('module_id');
    dropdown.innerHTML = '';

    if ( modules.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No modules found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.id;
        option.textContent = module.title;
        dropdown.appendChild(option);
    });
}

async function loadTimeUnits()
{
    const response = await getTimeUnitsAll();
    const timeUnits = response.data;
    const dropdown = document.getElementById('time_unit_id');
    dropdown.innerHTML = '';

    if ( timeUnits.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No time units found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    timeUnits.forEach(timeUnit => {
        const option = document.createElement('option');
        option.value = timeUnit.id;
        option.textContent = timeUnit.name;
        dropdown.appendChild(option);
    });
}