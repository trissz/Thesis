document.addEventListener('DOMContentLoaded', async () => {
    await loadAlgorithmsData();
});

async function getAlgorithmsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedAlgorithmsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithms');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadAlgorithmsData(page = currentPage)
{
    const container = document.getElementById('algorithm_gallery_container');

    try {
        const { algorithms, totalPages, totalRecords } = await getAlgorithmsDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        algorithms.forEach(algorithm => {
            container.innerHTML += `
                <div class="algorithm_card">
                    <div class="algorithm_card_header">
                        <h3 class="algorithm_name">${algorithm.name}</h3>

                        <div class="algorithm_stats">
                            <span class="algorithm_date">Created: ${formatDate(algorithm.createdAt)}</span>
                            <span class="algorithm_date">Last modified: ${formatDate(algorithm.updatedAt)}</span>
                        </div>
                    </div>

                    <div class="algorithm_meta">
                        <div class="meta_item">
                            <span class="algorithm_category_name">${algorithm.algorithmCategoryName}</span>
                        </div>

                        <div class="meta_item">
                            <span class="algorithm_difficulty_level_name">${algorithm.algorithmDifficultyLevelName}</span>
                        </div>
                    </div>

                    <div class="algorithm_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/algorithm/view/${algorithm.id}';">View algorithm</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: algorithms.length,
            container: container,
            onPageChange: (newPage) => loadAlgorithmsData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Category id', key: 'category_id', tags: ['p'] },
            { header: 'Difficulty level id', key: 'difficulty_level_id', tags: ['p'] },
            { header: 'Name', key: 'name', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, algorithms, columns, "algorithm", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadAlgorithmsData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching algorithms:', error);
    }
}