document.addEventListener('DOMContentLoaded', async () => {
    await loadRoles();
    await loadOperations();

    const dropdown = document.getElementById('role_id');

    if ( dropdown.value )
    {
        await loadPermissionsByRoleId(dropdown.value);
    }

    dropdown.addEventListener('change', async (event) => {
        const roleId = event.target.value;

        if ( roleId )
        {
            await loadPermissionsByRoleId(roleId);
        }
    });

    document.getElementById('save_permissions_btn').addEventListener('click', async (event) => {
        event.preventDefault();

        const saveBtn = document.getElementById('save_permissions_btn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = `<div class="loading-spinner"></div> Saving...`;

        try {
            const targetRoleId = document.getElementById('role_id').value;

            if ( !targetRoleId )
            {
                alert('Please select a role first!');
                return;
            }

            const checkboxes = document.querySelectorAll('.operation_checkbox');

            const checkedOperationIds = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.dataset.operationId, 10));

            const uncheckedOperationIds = Array.from(checkboxes)
                .filter(checkbox => !checkbox.checked)
                .map(checkbox => parseInt(checkbox.dataset.operationId, 10));

            const rolePermissionsResponse = await getPermissionsByRoleId(targetRoleId);

            if ( !rolePermissionsResponse.success )
            {
                throw new Error(`Failed to fetch permissions for role with ID ${targetRoleId}`);
            }

            const rolePermissions = rolePermissionsResponse.data;
            const currentOperationIds = rolePermissions.map(rolePermission => parseInt(rolePermission.operationId, 10));

            const operationsToAddIds = checkedOperationIds.filter(operationId => !currentOperationIds.includes(operationId));
            const operationsToRemoveIds = uncheckedOperationIds.filter(operationId => currentOperationIds.includes(operationId));

            const permissionSaveResponse = await fetch(`/permission/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operations_to_add_ids: operationsToAddIds,
                    operations_to_remove_ids: operationsToRemoveIds,
                    target_role_id: parseInt(targetRoleId, 10)
                })
            });

            if ( !permissionSaveResponse.ok )
            {
                throw new Error('Failed to update permissions');
            }

            const result = await permissionSaveResponse.json();
            
            if ( result.success )
            {
                alert('Permissions updated successfully!');
                await loadPermissionsByRoleId(targetRoleId);
            }
            else
            {
                throw new Error(result.error || 'Failed to save permissions');
            }
        } catch ( error ) {
            console.error('Error saving permissions:', error);
            alert(`Error saving permissions: ${error.message}`);
        } finally {
            saveBtn.innerHTML = originalText;
        }
    });
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
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        dropdown.appendChild(option);
    });
}

async function loadOperations()
{
    try {
        const response = await getOperationsAll();

        if ( !response.success )
        {
            throw new Error('Failed to fetch operations');
        }
        
        const grouped = groupOperations(response.data);
        const container = document.getElementById('entity_tabs_container');
        
        container.innerHTML = Object.entries(grouped).map(([entity, operations]) => `
            <div class="entity_tab_container">
                <span class="entity_container">${entity}</span>
                <span class="operations_container">
                ${operations.map(operation => `
                    <span class="operation_container">
                        <div class="operation_text">${operation.name}</div>
                        <input type="checkbox" class="operation_checkbox" data-operation-id="${operation.id}" id="operation_${operation.id}_checkbox">
                    </span>
                `).join('')}
                </span>
            </div>
        `).join('');
    } catch ( error ) {
        console.error('Error loading operations:', error);
    }

    /*Object.entries(groupedOperations).forEach(([key, value]) => {
        const entityOperationsContainer = document.createElement('div');
        entityOperationsContainer.classList.add('entity_tab_container');

        const entitySpan = document.createElement('span');
        entitySpan.classList.add('entity_container');
        entitySpan.textContent = key;

        const operationsSpan = document.createElement('span');
        operationsSpan.classList.add('operations_container');
        entityOperationsContainer.appendChild(entitySpan);

        value.forEach(entityOperation => {
            const operationSpan = document.createElement('span');
            operationSpan.classList.add('operation_container');

            const operationText = document.createElement('div');
            operationText.classList.add('operation_text');
            operationText.textContent = entityOperation.name;
            operationSpan.appendChild(operationText);

            const operationCheckbox = document.createElement('input');
            operationCheckbox.type = 'checkbox';
            operationCheckbox.classList.add('operation_checkbox');
            operationCheckbox.setAttribute('id', `operation_${entityOperation.id}_checkbox`);
            operationSpan.appendChild(operationCheckbox);
            operationsSpan.appendChild(operationSpan);
        });

        entityOperationsContainer.appendChild(operationsSpan);
        container.appendChild(entityOperationsContainer);
    });*/
}

async function loadPermissionsByRoleId(roleId)
{
    try {
        const response = await getPermissionsByRoleId(roleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch');
        }
  
        const permissions = response.data;

        Array.from(document.querySelectorAll('.operation_checkbox')).forEach(operationCheckbox => {
            operationCheckbox.checked = false;
        });

        permissions.forEach(permission => {
            document.getElementById(`operation_${permission.operationId}_checkbox`).checked = true;
        });
    } catch ( error ) {
        console.error('Error loading permissions:', error);
    }
}
  
function groupOperations(operations)
{
    return operations.reduce((accumulator, operation) => {
        const parts = operation.name.split(' ');
        const groupName = parts.splice(0, parts.length - 1).join(' ').toLowerCase();
        const key = groupName.charAt(0).toUpperCase() + groupName.slice(1);

        if ( !accumulator[key] )
        {
            accumulator[key] = [];
        }

        accumulator[key].push({...operation, checked: true});
        return accumulator;
    }, {});
}