document.addEventListener('DOMContentLoaded', async function() {
    await loadPermissionData();
});

async function getPermissionData()
{
    const permissionId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(permissionId) )
    {
        const form = document.getElementById('permission_update_form');

        if ( !form.action.endsWith(permissionId.toString()) )
        {
            form.action += permissionId;
        }
        
        const response = await getPermissionById(permissionId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch permission');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid permission ID');
    }
}

async function loadPermissionData()
{
    const permission = await getPermissionData();

    document.getElementById('role_id').value = permission.roleId;
    document.getElementById('operation_id').value = permission.operationId;
    document.getElementById('is_active').checked = permission.isActive;
}