document.addEventListener('DOMContentLoaded', () => {
    populateAlgorithmImplementationsDataTable();
});

async function getAlgorithmImplementationsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAlgorithmImplementationsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm implementations');
    }

    return response;
}

async function populateAlgorithmImplementationsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('algorithm_implementation_list_table_container');

    try {
        const response = await getAlgorithmImplementationsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { algorithmImplementations, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Algorithm ID', key: 'algorithm_id' },
            { header: 'Code language ID', key: 'code_language_id' },
            { header: 'Complexity ID', key: 'complexity_id' },
            { header: 'Name', key: 'name' },
            { header: 'Description', key: 'description' },
            { header: 'Code', key: 'code' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (algorithmImplementation) => {window.location.href = `/algorithm-implementation/update/${algorithmImplementation.id}`;} },
            { label: 'Delete', callback: async (algorithmImplementation) => {
                showConfirmationPanel(
                    `Are you sure you want to delete algorithm implementation ${algorithmImplementation.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/algorithm-implementation/delete/${algorithmImplementation.id}`);
                            alert(`Algorithm implementation ${algorithmImplementation.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && algorithmImplementation.length === 1 )
                            {
                                populateAlgorithmImplementationsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAlgorithmImplementationsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting algorithm implementation:', error);
                            alert('An error occurred while deleting the algorithm implementation.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, algorithmImplementations, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: algorithmImplementations.length,
                container: container,
                onPageChange: (newPage) => populateAlgorithmImplementationsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching algorithm implementations:', error);
    }
}