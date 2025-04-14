document.addEventListener('DOMContentLoaded', async () => {
    await populateTaskTypesDataTable();
});

async function getTaskTypesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getTaskTypesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated task types');
    }

    return response;
}

async function populateTaskTypesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('task_type_list_table_container');

    try {
        const response = await getTaskTypesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { taskTypes, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (taskType) => {window.location.href = `/time-type/update/${taskType.id}`;} },
            { label: 'Delete', callback: async (taskType) => {
                showConfirmationPanel(
                    `Are you sure you want to delete task type ${taskType.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/time-type/delete/${taskType.id}`);
                            alert(`Task type ${taskType.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && taskTypes.length === 1 )
                            {
                                populateTaskTypesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateTaskTypesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting task type:', error);
                            alert('An error occurred while deleting the task type.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, taskTypes, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: taskTypes.length,
                container: container,
                onPageChange: (newPage) => populateTaskTypesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching task types:', error);
    }
}