document.addEventListener('DOMContentLoaded', async () => {
    await loadAchievementCategoriesData();
});

async function getAchievementCategoriesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedAchievementCategoriesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated achievement categories');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadAchievementCategoriesData(page = currentPage)
{
    const container = document.getElementById('achievement_category_gallery_container');

    try {
        const { achievementCategories, totalPages, totalRecords } = await getAchievementCategoriesDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';
        
        achievementCategories.forEach(achievementCategory => {
            container.innerHTML += `
                <div class="achievement_category_card">
                    <div class="achievement_category_card_header">
                        <h3 class="achievement_category_name">${achievementCategory.name}</h3>

                        <div class="achievement_category_stats">
                            <span class="achievement_category_date">Created: ${formatDate(achievementCategory.createdAt)}</span>
                            <span class="achievement_category_date">Last modified: ${formatDate(achievementCategory.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: achievementCategories.length,
            container: container,
            onPageChange: (newPage) => loadAchievementCategoriesData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Name', key: 'name', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, achievementCategories, columns, "achievement-category", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadAchievementCategoriesData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching achievement categories:', error);
    }
}