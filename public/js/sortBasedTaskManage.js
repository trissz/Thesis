document.addEventListener('DOMContentLoaded', async () => {
    await populateSortBasedTasksDataTable();
});

async function getSortBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getSortBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated sort based tasks');
    }

    return response;
}

async function populateSortBasedTasksDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('sort_based_task_list_table_container');

    try {
        const response = await getSortBasedTasksDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { sortBasedTasks, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Difficulty level ID', key: 'difficultyLevelId' },
            { header: 'Content', key: 'content' },
            { header: 'Answer', key: 'answer' },
            { header: 'Elements', key: 'elements' },
            { header: 'Hints', key: 'hints' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (sortBasedTask) => {window.location.href = `/sort-based-task/update/${sortBasedTask.id}`;} },
            { label: 'Delete', callback: async (sortBasedTask) => {
                showConfirmationPanel(
                    `Are you sure you want to delete sort based task ${sortBasedTask.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/sort-based-task/delete/${sortBasedTask.id}`);
                            alert(`Sort based task ${sortBasedTask.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && sortBasedTask.length === 1 )
                            {
                                populateSortBasedTasksDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateSortBasedTasksDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting sort based task:', error);
                            alert('An error occurred while deleting the sort based task.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, sortBasedTasks, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: sortBasedTasks.length,
                container: container,
                onPageChange: (newPage) => populateSortBasedTasksDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching sort based tasks:', error);
    }
}