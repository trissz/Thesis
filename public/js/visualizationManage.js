document.addEventListener('DOMContentLoaded', () => {
    populateVisualizationsDataTable();
});

async function getVisualizationsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getVisualizationsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated visualizations');
    }

    return response;
}

async function populateVisualizationsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('visualization_list_table_container');

    try {
        const response = await getVisualizationsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { visualizations, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Title', key: 'title' },
            { header: 'Description', key: 'description' },
            { header: 'Script code', key: 'scriptCode' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (visualization) => {window.location.href = `/visualization/update/${visualization.id}`;} },
            { label: 'Delete', callback: async (visualization) => {
                showConfirmationPanel(
                    `Are you sure you want to delete visualization ${visualization.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/visualization/delete/${visualization.id}`);
                            alert(`Visualization ${visualization.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && visualizations.length === 1 )
                            {
                                populateVisualizationsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateVisualizationsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting visualization:', error);
                            alert('An error occurred while deleting the visualization.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, visualizations, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: visualizations.length,
                container: container,
                onPageChange: (newPage) => populateVisualizationsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching visualizations:', error);
    }
}