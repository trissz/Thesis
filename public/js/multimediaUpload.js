document.addEventListener('DOMContentLoaded', () => {
    loadMultimediaCategories();
});

async function loadMultimediaCategories()
{
    const response = await getMultimediaCategoriesAll();
    const multimediaCategories = response.data;
    const dropdown = document.getElementById('category_id');
    dropdown.innerHTML = '';

    if ( multimediaCategories.length === 0 )
    {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No multimedia categories found';
        option.disabled = true;
        option.selected = true;
        dropdown.appendChild(option);
        return;
    }

    multimediaCategories.forEach(multimediaCategory => {
        const option = document.createElement('option');
        option.value = multimediaCategory.id;
        option.textContent = multimediaCategory.name;
        dropdown.appendChild(option);
    });
}