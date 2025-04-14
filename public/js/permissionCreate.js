document.addEventListener('DOMContentLoaded', async () => {
    await loadRoles();
});

async function loadRoles()
{
    const response = await getRolesAll();
    const roles = response.data;
    const dropdown = document.getElementById('role_id');
    dropdown.innerHTML = '';

    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        dropdown.appendChild(option);
    });
}