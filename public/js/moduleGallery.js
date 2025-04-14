document.addEventListener('DOMContentLoaded', async () => {
    await loadModulesData();
});

async function getModulesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedModulesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated modules');
    }

    return response.data;
}

async function getModuleLessonsData(moduleId)
{
    const response = await getDetailedLessonsAllByModuleId(moduleId);

    if ( !response.success )
    {
        throw new Error('Failed to fetch lessons for module');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadModulesData(page = currentPage)
{
    const container = document.getElementById('module_gallery_container');
    
    try {
        const { modules, totalPages, totalRecords } = await getModulesDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        let moduleCardsHTML = '';

        for ( const module of modules )
        {
            const lessons = await getModuleLessonsData(module.id);
            let totalNumberOfSeconds = 0;

            lessons.forEach(lesson => {
                totalNumberOfSeconds += lesson.timeUnitSecondsEquivalent * lesson.estimatedTimeValue;
            });

            moduleCardsHTML += `
                <div class="module_card">
                    <div class="module_header">
                        <h3 class="module_title">${module.title}</h3>

                        <div class="module_stats">
                            <span class="module_date">Created: ${formatDate(module.createdAt)}</span>
                            <span class="module_date">Last modified: ${formatDate(module.updatedAt)}</span>
                        </div>
                    </div>
                    
                    <div class="module_meta">
                        <div class="meta_item">
                            <span class="lesson_count">${lessons.length || "Unknown"} Lesson(s)</span>
                        </div>

                        <div class="meta_item">
                            <svg class="meta_icon" ...></svg>

                            <span>~${formatTotalTime(totalNumberOfSeconds)}</span>
                        </div>
                    </div>

                    <p class="module_description">${module.description}</p>

                    <div class="module_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/module/view/${module.id}';">Explore Module</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = moduleCardsHTML;

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: modules.length,
            container: container,
            onPageChange: (newPage) => loadModulesData(newPage)
        };

        makePagination(pagination);

        /*const columns = [
            { header: 'Title', key: 'title', tags: ['h2'] },
            { header: 'Description', key: 'description', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, modules, columns, "module", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadModulesData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching modules:', error);
    }
}