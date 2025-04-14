document.addEventListener('DOMContentLoaded', () => {
    populateOperationsDataTable();
});

async function getOperationsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getOperationsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated operations');
    }

    return response;
}

async function populateOperationsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('operation_list_table_container');

    try {
        const response = await getOperationsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { operations, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Description', key: 'description' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (operation) => {window.location.href = `/operation/update/${operation.id}`;} },
            { label: 'Delete', callback: async (operation) => {
                showConfirmationPanel(
                    `Are you sure you want to delete operation ${operation.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/operation/delete/${operation.id}`);
                            alert(`Operation ${operation.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && operations.length === 1 )
                            {
                                populateOperationsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateOperationsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting operation:', error);
                            alert('An error occurred while deleting the operation.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, operations, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: operations.length,
                container: container,
                onPageChange: (newPage) => populateOperationsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching operations:', error);
    }
}