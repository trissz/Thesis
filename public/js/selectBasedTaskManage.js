document.addEventListener('DOMContentLoaded', () => {
    populateSelectBasedTasksDataTable();
});

async function getSelectBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getSelectBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated select based tasks');
    }

    return response;
}

async function populateSelectBasedTasksDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('select_based_task_list_table_container');

    try {
        const response = await getSelectBasedTasksDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { selectBasedTasks, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Difficulty level ID', key: 'difficultyLevelId' },
            { header: 'Content', key: 'content' },
            { header: 'Answer', key: 'answer' },
            { header: 'Options', key: 'options' },
            { header: 'Hints', key: 'hints' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (selectBasedTask) => {window.location.href = `/select-based-task/update/${selectBasedTask.id}`;} },
            { label: 'Delete', callback: async (selectBasedTask) => {
                showConfirmationPanel(
                    `Are you sure you want to delete select based task ${selectBasedTask.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/select-based-task/delete/${selectBasedTask.id}`);
                            alert(`Select based task ${selectBasedTask.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && selectBasedTask.length === 1 )
                            {
                                populateSelectBasedTasksDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateSelectBasedTasksDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting select based task:', error);
                            alert('An error occurred while deleting the select based task.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, selectBasedTasks, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: selectBasedTasks.length,
                container: container,
                onPageChange: (newPage) => populateSelectBasedTasksDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching select based tasks:', error);
    }
}