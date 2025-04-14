document.addEventListener('DOMContentLoaded', () => {
    populateModulesDataTable();
});

async function getModulesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getModulesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated modules');
    }

    return response;
}

async function populateModulesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('module_list_table_container');

    try {
        const response = await getModulesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { modules, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Title', key: 'title' },
            { header: 'Description', key: 'description' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (module) => {window.location.href = `/module/update/${module.id}`;} },
            { label: 'Delete', callback: async (module) => {
                showConfirmationPanel(
                    `Are you sure you want to delete module ${module.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/module/delete/${module.id}`);
                            alert(`Module ${module.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && modules.length === 1 )
                            {
                                populateModulesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateModulesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting module:', error);
                            alert('An error occurred while deleting the module.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, modules, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: modules.length,
                container: container,
                onPageChange: (newPage) => populateModulesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching modules:', error);
    }
}