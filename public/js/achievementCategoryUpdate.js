document.addEventListener('DOMContentLoaded', function() {
    loadAchievementCategoryData();
});

async function getAchievementCategoryData()
{
    const achievementCategoryId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(achievementCategoryId) )
    {
        const form = document.getElementById('achievement_category_update_form');

        if ( !form.action.endsWith(achievementCategoryId.toString()) )
        {
            form.action += achievementCategoryId;
        }

        const response = await getAchievementCategoryById(achievementCategoryId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch achievement category');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid achievement category ID');
    }
}

async function loadAchievementCategoryData()
{
    const achievementCategory = await getAchievementCategoryData();

    document.getElementById('name').value = achievementCategory.name;
    document.getElementById('is_active').checked = achievementCategory.isActive;
}