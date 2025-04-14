document.addEventListener('DOMContentLoaded', () => {
    populateLessonsDataTable();
});

async function getLessonsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getLessonsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated lessons');
    }

    return response;
}

async function populateLessonsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('lesson_list_table_container');

    try {
        const response = await getLessonsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { lessons, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Module Id', key: 'moduleId' },
            { header: 'Time unit Id', key: 'timeUnitId' },
            { header: 'Title', key: 'title' },
            { header: 'Content', key: 'content' },
            { header: 'Estimated time value', key: 'estimatedTimeValue' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (lesson) => {window.location.href = `/lesson/update/${lesson.id}`;} },
            { label: 'Delete', callback: async (lesson) => {
                showConfirmationPanel(
                    `Are you sure you want to delete lesson ${lesson.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/lesson/delete/${lesson.id}`);
                            alert(`Lesson ${lesson.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && lessons.length === 1 )
                            {
                                populateLessonsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateLessonsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting lesson:', error);
                            alert('An error occurred while deleting the lesson.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, lessons, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: lessons.length,
                container: container,
                onPageChange: (newPage) => populateLessonsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching lessons:', error);
    }
}