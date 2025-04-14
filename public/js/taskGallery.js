document.addEventListener('DOMContentLoaded', async () => {
    await loadTasksData();
});

async function getTasksDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedTasksPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated tasks');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadTasksData(page = currentPage)
{
    const container = document.getElementById('task_gallery_container');

    try {
        const { tasks, totalPages, totalRecords } = await getTasksDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        tasks.forEach(task => {
            container.innerHTML += `
                <div class="task_card">
                    <div class="task_header">
                        <p class="data_pill task_type_name">${task.taskTypeName}</p>
                        <p class="data_pill task_difficulty_level_name">${task.taskDifficultyLevelName}</p>

                        <div class="task_stats">
                            <span class="task_date">Created: ${formatDate(task.createdAt)}</span>
                            <span class="task_date">Last modified: ${formatDate(task.updatedAt)}</span>
                        </div>
                    </div>

                    <p class="task_content">${task.content}</p>

                    <div class="task_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/task/view/${task.id}';">View task</button>
                    </div>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: tasks.length,
            container: container,
            onPageChange: (newPage) => loadTasksData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Title', key: 'title', tags: ['h2'] },
            { header: 'Description', key: 'description', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, tasks, columns, "task", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadTasksData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching tasks:', error);
    }
}