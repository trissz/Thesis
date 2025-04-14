document.addEventListener('DOMContentLoaded', async () => {
    await loadSortBasedTasksData();
});

async function getDetailedSortBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedSortBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated sort based tasks');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadSortBasedTasksData(page = currentPage)
{
    const container = document.getElementById('sort_based_task_gallery_container');

    try {
        const { sortBasedTasks, totalPages, totalRecords } = await getDetailedSortBasedTasksDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        sortBasedTasks.forEach(sortBasedTask => {
            container.innerHTML += `
                <div class="sort_based_task_card">
                    <div class="sort_based_task_card_header">
                        <h3 class="sort_based_task_difficulty_level_name">${sortBasedTask.taskDifficultyLevelName}</h3>

                        <div class="sort_based_task_stats">
                            <span class="sort_based_task_date">Created: ${formatDate(sortBasedTask.createdAt)}</span>
                            <span class="sort_based_task_date">Last modified: ${formatDate(sortBasedTask.updatedAt)}</span>
                        </div>
                    </div>
                    
                    <div class="sort_based_task_meta">
                        <div class="meta_item">
                            <span class="sort_based_task_content">${sortBasedTask.content}</span>
                        </div>
                    </div>

                    <div class="sort_based_task_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/sort-based-task/view/${sortBasedTask.id}';">Solve task</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: sortBasedTasks.length,
            container: container,
            onPageChange: (newPage) => loadSortBasedTasksData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Difficulty level', key: 'taskDifficultyLevelName', tags: ['p'] },
            { header: 'Content', key: 'content', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, sortBasedTasks, columns, "sort-based-task", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadSortBasedTasksData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching sort based tasks:', error);
    }
}