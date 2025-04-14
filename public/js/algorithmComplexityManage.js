document.addEventListener('DOMContentLoaded', () => {
    populateAlgorithmComplexitiesDataTable();
});

async function getAlgorithmComplexitiesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAlgorithmComplexitiesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm complexities');
    }

    return response;
}

async function populateAlgorithmComplexitiesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('algorithm_complexity_list_table_container');

    try {
        const response = await getAlgorithmComplexitiesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { algorithmComplexities, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Notation', key: 'notation' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (algorithmComplexity) => {window.location.href = `/algorithm-complexity/update/${algorithmComplexity.id}`;} },
            { label: 'Delete', callback: async (algorithmComplexity) => {
                showConfirmationPanel(
                    `Are you sure you want to delete algorithm complexity ${algorithmComplexity.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/multimedia-category/delete/${algorithmComplexity.id}`);
                            alert(`Algorithm Complexity ${algorithmComplexity.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && algorithmComplexities.length === 1 )
                            {
                                populateAlgorithmComplexitiesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAlgorithmComplexitiesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting algorithm complexity:', error);
                            alert('An error occurred while deleting the algorithm complexity.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, algorithmComplexities, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: algorithmComplexities.length,
                container: container,
                onPageChange: (newPage) => populateAlgorithmComplexitiesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching algorithm complexities:', error);
    }
}