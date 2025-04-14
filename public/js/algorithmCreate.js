document.addEventListener('DOMContentLoaded', () => {
    loadAlgorithmCategories();
    loadAlgorithmDifficultyLevels();
});

async function loadAlgorithmCategories()
{
    const response = await getAlgorithmCategoriesAll();
    const algorithmCategories = response.data;
    const dropdown = document.getElementById('category_id');
    dropdown.innerHTML = '';

    if ( algorithmCategories.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No algorithm categories found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    algorithmCategories.forEach(algorithmCategory => {
        const option = document.createElement('option');
        option.value = algorithmCategory.id;
        option.textContent = algorithmCategory.name;
        dropdown.appendChild(option);
    });
}

async function loadAlgorithmDifficultyLevels()
{
    const response = await getAlgorithmDifficultyLevelsAll();
    const algorithmDifficultyLevels = response.data;
    const dropdown = document.getElementById('difficulty_level_id');
    dropdown.innerHTML = '';

    if ( algorithmDifficultyLevels.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No algorithm difficulty levels found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    algorithmDifficultyLevels.forEach(algorithmDifficultyLevel => {
        const option = document.createElement('option');
        option.value = algorithmDifficultyLevel.id;
        option.textContent = algorithmDifficultyLevel.name;
        dropdown.appendChild(option);
    });
}