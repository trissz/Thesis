document.addEventListener('DOMContentLoaded', () => {
    populateInputBasedTasksDataTable();
});

async function getInputBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getInputBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated input based tasks');
    }

    return response;
}

async function populateInputBasedTasksDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('input_based_task_list_table_container');

    try {
        const response = await getInputBasedTasksDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { inputBasedTasks, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Difficulty level ID', key: 'difficultyLevelId' },
            { header: 'Content', key: 'content' },
            { header: 'Answer', key: 'answer' },
            { header: 'Hints', key: 'hints' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (inputBasedTask) => {window.location.href = `/input-based-task/update/${inputBasedTask.id}`;} },
            { label: 'Delete', callback: async (inputBasedTask) => {
                showConfirmationPanel(
                    `Are you sure you want to delete input based task ${inputBasedTask.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/input-based-task/delete/${inputBasedTask.id}`);
                            alert(`Input based task ${inputBasedTask.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && inputBasedTask.length === 1 )
                            {
                                populateInputBasedTasksDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateInputBasedTasksDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting input based task:', error);
                            alert('An error occurred while deleting the input based task.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, inputBasedTasks, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: inputBasedTasks.length,
                container: container,
                onPageChange: (newPage) => populateInputBasedTasksDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching input based tasks:', error);
    }
}