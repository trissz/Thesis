document.addEventListener('DOMContentLoaded', async () => {
    await loadVisualizationsData();
});

async function getVisualizationsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedVisualizationsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated visualizations');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadVisualizationsData(page = currentPage)
{
    const container = document.getElementById('visualization_gallery_container');

    try {
        const { visualizations, totalPages, totalRecords } = await getVisualizationsDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        visualizations.forEach(visualization => {
            container.innerHTML += `
                <div class="visualization_card">
                    <div class="visualization_header">
                        <h3 class="visualization_title">${visualization.title}</h3>

                        <div class="visualization_stats">
                            <span class="visualization_date">Created: ${formatDate(visualization.createdAt)}</span>
                            <span class="visualization_date">Last modified: ${formatDate(visualization.updatedAt)}</span>
                        </div>
                    </div>

                    <p class="visualization_description">${visualization.description}</p>

                    <div class="visualization_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/visualization/view/${visualization.id}';">View visualization</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: visualizations.length,
            container: container,
            onPageChange: (newPage) => loadVisualizationsData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Title', key: 'title', tags: ['h2'] },
            { header: 'Description', key: 'description', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, visualizations, columns, "visualization", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadVisualizationsData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching visualizations:', error);
    }
}