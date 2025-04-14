document.addEventListener('DOMContentLoaded', function() {
    loadMultimediaData();
});

async function getMultimediaData()
{
    const multimediaId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(multimediaId) )
    {
        const form = document.getElementById('multimedia_update_form');

        if ( !form.action.endsWith(multimediaId.toString()) )
        {
            form.action += multimediaId;
        }
        
        const response = await getMultimediaById(multimediaId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch multimedia');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid multimedia ID');
    }
}

async function loadMultimediaData()
{
    const multimedia = await getMultimediaData();

    document.getElementById('categoryId').value = multimedia.categoryId;
    //document.getElementById('file').value = multimedia.file; //Implement.....
    document.getElementById('is_active').checked = multimedia.isActive;
}