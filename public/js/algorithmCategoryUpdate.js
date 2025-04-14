document.addEventListener('DOMContentLoaded', function() {
    loadAlgorithmCategoryData();
});

async function getAlgorithmCategoryData()
{
    const algorithmCategoryId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(algorithmCategoryId) )
    {
        const form = document.getElementById('algorithm_category_update_form');

        if ( !form.action.endsWith(algorithmCategoryId.toString()) )
        {
            form.action += algorithmCategoryId;
        }
        
        const response = await getAlgorithmCategoryById(algorithmCategoryId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm category');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid algorithm category ID');
    }
}

async function loadAlgorithmCategoryData()
{
    const algorithmCategory = await getAlgorithmCategoryData();

    document.getElementById('name').value = algorithmCategory.name;
    document.getElementById('is_active').checked = algorithmCategory.isActive;
}