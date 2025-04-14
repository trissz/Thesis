document.addEventListener('DOMContentLoaded', async () => {
    await loadLessonsData();
});

async function getLessonsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedLessonsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated lessons');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadLessonsData(page = currentPage)
{
    const container = document.getElementById('lesson_gallery_container');

    try {
        const { lessons, totalPages, totalRecords } = await getLessonsDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        lessons.forEach(lesson => {
            container.innerHTML += `
                <div class="lesson_card">
                    <div class="card_content">
                        <div class="card_header">
                            <div class="card_badge">${lesson.moduleTitle}</div>

                            <time class="card_time" datetime="${lesson.createdAt}">
                                ${formatTimeAgo(lesson.createdAt)}
                            </time>
                        </div>

                        <h3 class="card_title">${lesson.title}</h3>

                        <div class="divider"></div>

                        <div class="card_meta">
                            <div class="meta_item">
                                <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                
                                <span>~${lesson.estimatedTimeValue} ${lesson.timeUnitName}</span>
                            </div>
                            <span>
                                Created:
                                    ${new Date(lesson.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                            </span>
                            
                            <span>
                                Last modified:
                                    ${new Date(lesson.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                            </span>
                        </div>

                        <div class="divider"></div>

                        <div class="card_footer">
                            <button class="view_action_btn" onclick="window.location.href = '/lesson/view/${lesson.id}';">View Lesson</button>
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
            dataLength: lessons.length,
            container: container,
            onPageChange: (newPage) => loadLessonsData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Module title', key: 'moduleTitle', tags: ['h2'] },
            { header: 'Estimated time', key: 'estimatedTimeValue', tags: ['p'] },
            { header: 'Time unit notation', key: 'timeUnitNotation', tags: ['p'] },
            { header: 'Title', key: 'title', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, lessons, columns, "lesson", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadLessonsData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching lessons:', error);
    }
}