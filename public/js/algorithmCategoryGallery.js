document.addEventListener('DOMContentLoaded', async () => {
    await loadAlgorithmCategoriesData();
});

async function getAlgorithmCategoriesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedAlgorithmCategoriesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm categories');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadAlgorithmCategoriesData(page = currentPage)
{
    const container = document.getElementById('algorithm_category_gallery_container');

    try {
        const { algorithmCategories, totalPages, totalRecords } = await getAlgorithmCategoriesDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        algorithmCategories.forEach(algorithmCategory => {
            container.innerHTML += `
                <div class="algorithm_category_card">
                    <div class="algorithm_category_card_header">
                        <h3 class="algorithm_category_name">${algorithmCategory.name}</h3>

                        <div class="algorithm_category_stats">
                            <span class="algorithm_category_date">Created: ${formatDate(algorithmCategory.createdAt)}</span>
                            <span class="algorithm_category_date">Last modified: ${formatDate(algorithmCategory.updatedAt)}</span>
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
            dataLength: algorithmCategories.length,
            container: container,
            onPageChange: (newPage) => loadAlgorithmCategoriesData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Name', key: 'name', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, algorithmCategories, columns, "algorithm-category", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadAlgorithmCategoriesData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching algorithm categories:', error);
    }
}