document.addEventListener('DOMContentLoaded', async () => {
    await loadInputBasedTasksData();
});

async function getDetailedInputBasedTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedInputBasedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated input based tasks');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadInputBasedTasksData(page = currentPage)
{
    const container = document.getElementById('input_based_task_gallery_container');

    try {
        const { inputBasedTasks, totalPages, totalRecords } = await getDetailedInputBasedTasksDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        inputBasedTasks.forEach(inputBasedTask => {
            container.innerHTML += `
                <div class="input_based_task_card">
                    <div class="input_based_task_card_header">
                        <h3 class="input_based_task_difficulty_level_name">${inputBasedTask.taskDifficultyLevelName}</h3>

                        <div class="input_based_task_stats">
                            <span class="input_based_task_date">Created: ${formatDate(inputBasedTask.createdAt)}</span>
                            <span class="input_based_task_date">Last modified: ${formatDate(inputBasedTask.updatedAt)}</span>
                        </div>
                    </div>
                    
                    <div class="input_based_task_meta">
                        <div class="meta_item">
                            <span class="input_based_task_content">${inputBasedTask.content}</span>
                        </div>
                    </div>

                    <div class="input_based_task_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/input-based-task/view/${inputBasedTask.id}';">Solve task</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: inputBasedTasks.length,
            container: container,
            onPageChange: (newPage) => loadInputBasedTasksData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Difficulty level', key: 'taskDifficultyLevelName', tags: ['p'] },
            { header: 'Content', key: 'content', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, inputBasedTasks, columns, "input-based-task", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadInputBasedTasksData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching input based tasks:', error);
    }
}