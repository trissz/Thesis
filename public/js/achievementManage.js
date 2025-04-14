document.addEventListener('DOMContentLoaded', () => {
    populateAchievementsDataTable();
});

async function getAchievementsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAchievementsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated achievements');
    }

    return response;
}

async function populateAchievementsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('achievement_list_table_container');

    try {
        const response = await getAchievementsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { achievements, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'User Id', key: 'userId' },
            { header: 'Category Id', key: 'categoryId' },
            { header: 'Title', key: 'title' },
            { header: 'Description', key: 'description' },
            { header: 'Value', key: 'value' },
            { header: 'Date awarded', key: 'dateAwarded' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (achievement) => {window.location.href = `/achievement/update/${achievement.id}`;} },
            { label: 'Delete', callback: async (achievement) => {
                showConfirmationPanel(
                    `Are you sure you want to delete achievement ${achievement.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/achievement/delete/${achievement.id}`);
                            alert(`Achievement ${achievement.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && achievements.length === 1 )
                            {
                                populateAchievementsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAchievementsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting achievement:', error);
                            alert('An error occurred while deleting the achievement.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, achievements, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: achievements.length,
                container: container,
                onPageChange: (newPage) => populateAchievementsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
}