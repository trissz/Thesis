document.addEventListener('DOMContentLoaded', async () => {
    await populateTimeUnitsDataTable();
});

async function getTimeUnitsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getTimeUnitsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated time units');
    }

    return response;
}

async function populateTimeUnitsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('time_unit_list_table_container');

    try {
        const response = await getTimeUnitsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { timeUnits, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Notation', key: 'notation' },
            { header: 'Seconds equivalent', key: 'secondsEquivalent' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (timeUnit) => {window.location.href = `/time-unit/update/${timeUnit.id}`;} },
            { label: 'Delete', callback: async (timeUnit) => {
                showConfirmationPanel(
                    `Are you sure you want to delete time unit ${timeUnit.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/time-unit/delete/${timeUnit.id}`);
                            alert(`Time unit ${timeUnit.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && timeUnits.length === 1 )
                            {
                                populateTimeUnitsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateTimeUnitsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting time unit:', error);
                            alert('An error occurred while deleting the time unit.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, timeUnits, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: timeUnits.length,
                container: container,
                onPageChange: (newPage) => populateTimeUnitsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching time units:', error);
    }
}