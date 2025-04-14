document.addEventListener('DOMContentLoaded', () => {
    populateFeedbackDataTable();
});

async function getFeedbackDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getFeedbackPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated feedback');
    }

    return response;
}

async function populateFeedbackDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('feedback_list_table_container');

    try {
        const response = await getFeedbackDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { feedbackList, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'User Id', key: 'userId' },
            { header: 'Topic', key: 'topic' },
            { header: 'Content', key: 'content' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (feedback) => {window.location.href = `/feedback/update/${feedback.id}`;} },
            { label: 'Delete', callback: async (feedback) => {
                showConfirmationPanel(
                    `Are you sure you want to delete feedback ${feedback.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/feedback/delete/${feedback.id}`);
                            alert(`Feedback ${feedback.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && feedbackList.length === 1 )
                            {
                                populateFeedbackDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateFeedbackDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting feedback:', error);
                            alert('An error occurred while deleting the feedback.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, feedbackList, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: feedbackList.length,
                container: container,
                onPageChange: (newPage) => populateFeedbackDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching feedback:', error);
    }
}