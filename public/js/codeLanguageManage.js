document.addEventListener('DOMContentLoaded', () => {
    populateCodeLanguagesDataTable();
});

async function getCodeLanguagesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getCodeLanguagesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated code languages');
    }

    return response;
}

async function populateCodeLanguagesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('code_language_list_table_container');

    try {
        const response = await getCodeLanguagesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { codeLanguages, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Notation', key: 'notation' },
            { header: 'Key string', key: 'keyString' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (codeLanguage) => {window.location.href = `/code-language/update/${codeLanguage.id}`;} },
            { label: 'Delete', callback: async (codeLanguage) => {
                showConfirmationPanel(
                    `Are you sure you want to delete code language ${codeLanguage.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/code-language/delete/${codeLanguage.id}`);
                            alert(`Code language ${codeLanguage.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && codeLanguages.length === 1 )
                            {
                                populateCodeLanguagesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateCodeLanguagesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting code language:', error);
                            alert('An error occurred while deleting the code language.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, codeLanguages, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: codeLanguages.length,
                container: container,
                onPageChange: (newPage) => populateCodeLanguagesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching code languages:', error);
    }
}