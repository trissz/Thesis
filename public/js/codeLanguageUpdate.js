document.addEventListener('DOMContentLoaded', function() {
    loadCodeLanguageData();
});

async function getCodeLanguageData()
{
    const codeLanguageId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(codeLanguageId) )
    {
        const form = document.getElementById('code_language_update_form');

        if ( !form.action.endsWith(codeLanguageId.toString()) )
        {
            form.action += codeLanguageId;
        }
        
        const response = await getCodeLanguageById(codeLanguageId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch code language');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid code language ID');
    }
}

async function loadCodeLanguageData()
{
    const codeLanguage = await getCodeLanguageData();

    document.getElementById('name').value = codeLanguage.name;
    document.getElementById('notation').value = codeLanguage.notation;
    document.getElementById('key_string').value = codeLanguage.keyString;
    document.getElementById('description').value = codeLanguage.description;
    document.getElementById('is_active').checked = codeLanguage.isActive;
}