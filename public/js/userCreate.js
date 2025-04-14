document.addEventListener('DOMContentLoaded', async () => {
    await loadRoles();
});

async function loadRoles()
{
    const response = await getRolesAll();
    const roles = response.data;
    const dropdown = document.getElementById('role_id');
    dropdown.innerHTML = '';

    if ( roles.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No roles found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    roles.forEach(role => {
        if ( role.id !== 1 ) //Admin role ID
        {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            dropdown.appendChild(option);
        }
    });
}