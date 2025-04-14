document.addEventListener('DOMContentLoaded', function() {
    loadRoleData();
});

async function getRoleData()
{
    const roleId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(roleId) )
    {
        const form = document.getElementById('role_update_form');

        if ( !form.action.endsWith(roleId.toString()) )
        {
            form.action += roleId;
        }
        
        const response = await getRoleById(roleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch role');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid role ID');
    }
}

async function loadRoleData()
{
    const role = await getRoleData();

    document.getElementById('name').value = role.name;
    document.getElementById('description').value = role.description;
    document.getElementById('is_active').checked = role.isActive;
}