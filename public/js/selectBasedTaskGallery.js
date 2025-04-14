document.addEventListener('DOMContentLoaded', async () => {
    await loadSelectBasedTasksData();
});

async function getDetailedSelectBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedSelectBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated select based tasks');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadSelectBasedTasksData(page = currentPage)
{
    const container = document.getElementById('select_based_task_gallery_container');

    try {
        const { selectBasedTasks, totalPages, totalRecords } = await getDetailedSelectBasedTasksDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        selectBasedTasks.forEach(selectBasedTask => {
            container.innerHTML += `
                <div class="select_based_task_card">
                    <div class="select_based_task_card_header">
                        <h3 class="select_based_task_difficulty_level_name">${selectBasedTask.taskDifficultyLevelName}</h3>

                        <div class="select_based_task_stats">
                            <span class="select_based_task_date">Created: ${formatDate(selectBasedTask.createdAt)}</span>
                            <span class="select_based_task_date">Last modified: ${formatDate(selectBasedTask.updatedAt)}</span>
                        </div>
                    </div>
                    
                    <div class="select_based_task_meta">
                        <div class="meta_item">
                            <span class="select_based_task_content">${selectBasedTask.content}</span>
                        </div>
                    </div>

                    <div class="select_based_task_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/select-based-task/view/${selectBasedTask.id}';">Solve task</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: selectBasedTasks.length,
            container: container,
            onPageChange: (newPage) => loadSelectBasedTasksData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Difficulty level', key: 'taskDifficultyLevelName', tags: ['p'] },
            { header: 'Content', key: 'content', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, selectBasedTasks, columns, "select-based-task", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadSelectBasedTasksData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching select based tasks:', error);
    }
}