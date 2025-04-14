document.addEventListener('DOMContentLoaded', async () => {
    await populateTasksDataTable();
});

async function getTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated tasks');
    }

    return response;
}

async function populateTasksDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('task_list_table_container');

    try {
        const response = await getTasksDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { tasks, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Task type ID', key: 'typeId' },
            { header: 'Task difficulty level ID', key: 'difficultyLevelId' },
            { header: 'Task content', key: 'content' },
            { header: 'Task answer', key: 'answer' },
            { header: 'Task elements', key: 'elements' },
            { header: 'Task hints', key: 'hints' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (task) => {window.location.href = `/task/update/${task.id}`;} },
            { label: 'Delete', callback: async (task) => {
                const confirmed = confirm(`Are you sure you want to delete task ${task.name}?`);

                if ( confirmed )
                {
                    try {
                        await deleteRecord(`/task/delete/${task.id}`);
                        alert(`Task ${task.name} deleted successfully.`);
                        
                        if ( currentPage > 1 && tasks.length === 1 )
                        {
                            populateTasksDataTable(currentPage - 1);
                        }
                        else
                        {
                            populateTasksDataTable(currentPage);
                        }
                    } catch ( error ) {
                        console.error('Error deleting task:', error);
                        alert('An error occurred while deleting the task.');
                    }
                }
            } }
        ];        

        generateTable(container, tasks, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: tasks.length,
                container: container,
                onPageChange: (newPage) => populateTasksDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching tasks:', error);
    }
}