document.addEventListener('DOMContentLoaded', () => {
    populateMultimediaDataTable();
});

async function getMultimediaDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getMultimediaPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated multimedia list');
    }

    return response;
}

async function populateMultimediaDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('multimedia_list_table_container');

    try {
        const response = await getMultimediaDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { multimediaList, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Category Id', key: 'categoryId' },
            { header: 'File name', key: 'fileName' },
            { header: 'File path', key: 'filePath' },
            { header: 'File type', key: 'fileType' },
            { header: 'File size', key: 'fileSize' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (multimedia) => {window.location.href = `/multimedia/update/${multimedia.id}`;} },
            { label: 'Delete', callback: async (multimedia) => {
                showConfirmationPanel(
                    `Are you sure you want to delete multimedia ${multimedia.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/multimedia/delete/${multimedia.id}`);
                            alert(`Multimedia ${multimedia.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && multimediaList.length === 1 )
                            {
                                populateMultimediaListDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateMultimediaListDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting multimedia:', error);
                            alert('An error occurred while deleting the multimedia.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, multimediaList, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: multimediaList.length,
                container: container,
                onPageChange: (newPage) => populateMultimediaListDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching multimedia list:', error);
    }
}