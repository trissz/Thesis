document.addEventListener('DOMContentLoaded', () => {
    populateAchievementCategoriesDataTable();
});

async function getAchievementCategoriesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getAchievementCategoriesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated achievement categories');
    }

    return response;
}

async function populateAchievementCategoriesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('achievement_category_list_table_container');

    try {
        const response = await getAchievementCategoriesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { achievementCategories, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (achievementCategory) => {window.location.href = `/achievement-category/update/${achievementCategory.id}`;} },
            { label: 'Delete', callback: async (achievementCategory) => {
                showConfirmationPanel(
                    `Are you sure you want to delete achievement category ${achievementCategory.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/achievement-category/delete/${achievementCategory.id}`);
                            alert(`Achievement category ${achievementCategory.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && achievementCategories.length === 1 )
                            {
                                populateAchievementCategoriesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateAchievementCategoriesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting achievement category:', error);
                            alert('An error occurred while deleting the achievement category.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, achievementCategories, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: achievementCategories.length,
                container: container,
                onPageChange: (newPage) => populateAchievementCategoriesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching achievement categories:', error);
    }
}