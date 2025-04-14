document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();
});

async function getUserData()
{
    const userId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(userId) )
    {
        const form = document.getElementById('user_update_form');

        if ( !form.action.endsWith(userId.toString()) )
        {
            form.action += userId;
        }

        const response = await getUserById(userId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch user');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid user ID');
    }
}

async function loadUserData()
{
    const user = await getUserData();

    document.getElementById('name').value = user.name;
    document.getElementById('is_active').checked = user.isActive;
}