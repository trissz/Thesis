document.addEventListener('DOMContentLoaded', () => {
    populateAlgorithmCategoriesDataTable();
});

async function getAlgorithmCategoriesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAlgorithmCategoriesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm categories');
    }

    return response;
}

async function populateAlgorithmCategoriesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('algorithm_category_list_table_container');

    try {
        const response = await getAlgorithmCategoriesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { algorithmCategories, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (algorithmCategory) => {window.location.href = `/algorithm-category/update/${algorithmCategory.id}`;} },
            { label: 'Delete', callback: async (algorithmCategory) => {
                showConfirmationPanel(
                    `Are you sure you want to delete algorithm category ${algorithmCategory.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/algorithm-category/delete/${algorithmCategory.id}`);
                            alert(`Algorithm category ${algorithmCategory.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && algorithmCategories.length === 1 )
                            {
                                populateAlgorithmCategoriesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAlgorithmCategoriesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting algorithm category:', error);
                            alert('An error occurred while deleting the algorithm category.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, algorithmCategories, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: algorithmCategories.length,
                container: container,
                onPageChange: (newPage) => populateAlgorithmCategoriesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching algorithm categories:', error);
    }
}