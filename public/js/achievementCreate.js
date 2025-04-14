document.addEventListener('DOMContentLoaded', () => {
    loadAchievementCategories();
});

async function loadAchievementCategories()
{
    const response = await getAchievementCategoriesAll();
    const achievementCategories = response.data;
    const dropdown = document.getElementById('category_id');
    dropdown.innerHTML = '';

    if ( achievementCategories.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No achievement categories found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    achievementCategories.forEach(achievementCategory => {
        const option = document.createElement('option');
        option.value = achievementCategory.id;
        option.textContent = achievementCategory.name;
        dropdown.appendChild(option);
    });
}