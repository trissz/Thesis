document.addEventListener('DOMContentLoaded', () => {
    populateMultimediaCategoriesDataTable();
});

async function getMultimediaCategoriesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getMultimediaCategoriesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated multimedia categories');
    }

    return response;
}

async function populateMultimediaCategoriesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('multimedia_category_list_table_container');

    try {
        const response = await getMultimediaCategoriesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { multimediaCategories, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (multimediaCategory) => {window.location.href = `/multimedia-category/update/${multimediaCategory.id}`;} },
            { label: 'Delete', callback: async (multimediaCategory) => {
                showConfirmationPanel(
                    `Are you sure you want to delete multimedia category ${multimediaCategory.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/multimedia-category/delete/${multimediaCategory.id}`);
                            alert(`Multimedia category ${multimediaCategory.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && multimediaCategories.length === 1 )
                            {
                                populateMultimediaCategoriesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateMultimediaCategoriesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting multimedia category:', error);
                            alert('An error occurred while deleting the multimedia category.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, multimediaCategories, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: multimediaCategories.length,
                container: container,
                onPageChange: (newPage) => populateMultimediaCategoriesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching multimedia categories:', error);
    }
}