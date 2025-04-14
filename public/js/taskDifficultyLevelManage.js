document.addEventListener('DOMContentLoaded', async () => {
    await populateTaskDifficultyLevelsDataTable();
});

async function getTaskDifficultyLevelsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getTaskDifficultyLevelsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated task difficulty levels');
    }

    return response;
}

async function populateTaskDifficultyLevelsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('task_difficulty_level_list_table_container');

    try {
        const response = await getTaskDifficultyLevelsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { taskDifficultyLevels, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Description', key: 'description' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (taskDifficultyLevel) => {window.location.href = `/task-difficulty-level/update/${taskDifficultyLevel.id}`;} },
            { label: 'Delete', callback: async (taskDifficultyLevel) => {
                showConfirmationPanel(
                    `Are you sure you want to delete task difficulty level ${taskDifficultyLevel.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/task-difficulty-level/delete/${taskDifficultyLevel.id}`);
                            alert(`Task difficulty level ${taskDifficultyLevel.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && taskDifficultyLevels.length === 1 )
                            {
                                populateTaskDifficultyLevelsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateTaskDifficultyLevelsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting task difficulty level:', error);
                            alert('An error occurred while deleting the task difficulty level.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, taskDifficultyLevels, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: taskDifficultyLevels.length,
                container: container,
                onPageChange: (newPage) => populateTaskDifficultyLevelsDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching task difficulty levels:', error);
    }
}