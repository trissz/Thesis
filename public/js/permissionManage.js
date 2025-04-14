document.addEventListener('DOMContentLoaded', () => {
    populatePermissionsDataTable();
});

async function getPermissionsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getPermissionsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated permissions');
    }

    return response;
}

async function populatePermissionsDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('permission_list_table_container');

    try {
        const response = await getPermissionsDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { permissions, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Role Id', key: 'roleId' },
            { header: 'Operation Id', key: 'OperationId' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (permission) => {window.location.href = `/permission/update/${permission.id}`;} },
            { label: 'Delete', callback: async (permission) => {
                showConfirmationPanel(
                    `Are you sure you want to delete permission ${permission.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/permission/delete/${permission.id}`);
                            alert(`Permission ${permission.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && permissions.length === 1 )
                            {
                                populatePermissionsDataTable(currentPage - 1);
                            }
                            else
                            {
                                populatePermissionsDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting permission:', error);
                            alert('An error occurred while deleting the permission.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, permissions, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: permissions.length,
                container: container,
                onPageChange: (newPage) => populatePermissionsDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
}