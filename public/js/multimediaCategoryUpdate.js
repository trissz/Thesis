document.addEventListener('DOMContentLoaded', function() {
    loadMultimediaCategoryData();
});

async function getMultimediaCategoryData()
{
    const multimediaCategoryId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(multimediaCategoryId) )
    {
        const form = document.getElementById('multimedia_category_update_form');

        if ( !form.action.endsWith(multimediaCategoryId.toString()) )
        {
            form.action += multimediaCategoryId;
        }
        
        const response = await getMultimediaCategoryById(multimediaCategoryId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch multimedia category');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid multimedia category ID');
    }
}

async function loadMultimediaCategoryData()
{
    const multimediaCategory = await getMultimediaCategoryData();

    document.getElementById('name').value = multimediaCategory.name;
    document.getElementById('is_active').checked = multimediaCategory.isActive;
}