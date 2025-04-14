document.addEventListener('DOMContentLoaded', () => {
    populateAlgorithmsDataTable();
});

async function getAlgorithmsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAlgorithmsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithms');
    }

    return response;
}

async function populateAlgorithmsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('algorithm_list_table_container');

    try {
        const response = await getAlgorithmsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { algorithms, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Category Id', key: 'categoryId' },
            { header: 'Difficulty level Id', key: 'difficultyLevelId' },
            { header: 'Name', key: 'name' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (algorithm) => {window.location.href = `/algorithm/update/${algorithm.id}`;} },
            { label: 'Delete', callback: async (algorithm) => {
                showConfirmationPanel(
                    `Are you sure you want to delete algorithm ${algorithm.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/algorithm/delete/${algorithm.id}`);
                            alert(`Algorithm ${algorithm.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && algorithms.length === 1 )
                            {
                                populateAlgorithmsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAlgorithmsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting algorithm:', error);
                            alert('An error occurred while deleting the algorithm.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, algorithms, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: algorithms.length,
                container: container,
                onPageChange: (newPage) => populateAlgorithmsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching algorithms:', error);
    }
}