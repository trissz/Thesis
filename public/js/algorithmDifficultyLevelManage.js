document.addEventListener('DOMContentLoaded', () => {
    populateAlgorithmDifficultyLevelsDataTable();
});

async function getAlgorithmDifficultyLevelsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAlgorithmDifficultyLevelsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm difficulty levels');
    }

    return response;
}

async function populateAlgorithmDifficultyLevelsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('algorithm_difficulty_level_list_table_container');

    try {
        const response = await getAlgorithmDifficultyLevelsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { algorithmDifficultyLevels, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Description', key: 'description' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (algorithmDifficultyLevel) => {window.location.href = `/algorithm-difficulty-level/update/${algorithmDifficultyLevel.id}`;} },
            { label: 'Delete', callback: async (algorithmDifficultyLevel) => {
                showConfirmationPanel(
                    `Are you sure you want to delete algorithm difficulty level ${algorithmDifficultyLevel.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/algorithm-difficulty-level/delete/${algorithmDifficultyLevel.id}`);
                            alert(`Algorithm difficulty level ${algorithmDifficultyLevel.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && algorithmDifficultyLevels.length === 1 )
                            {
                                populateAlgorithmDifficultyLevelsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAlgorithmDifficultyLevelsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting algorithm difficulty level:', error);
                            alert('An error occurred while deleting the algorithm difficulty level.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, algorithmDifficultyLevels, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: algorithmDifficultyLevels.length,
                container: container,
                onPageChange: (newPage) => populateAlgorithmDifficultyLevelsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching algorithm difficulty levels:', error);
    }
}