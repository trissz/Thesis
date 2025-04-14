document.addEventListener('DOMContentLoaded', () => {
    populateRolesDataTable();
});

async function getRolesDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getRolesPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated roles');
    }

    return response;
}

async function populateRolesDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('role_list_table_container');

    try {
        const response = await getRolesDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { roles, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Name', key: 'name' },
            { header: 'Description', key: 'description' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'ipdatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (role) => {window.location.href = `/role/update/${role.id}`;} },
            { label: 'Delete', callback: async (role) => {
                showConfirmationPanel(
                    `Are you sure you want to delete role ${role.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/role/delete/${role.id}`);
                            alert(`Role ${role.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && roles.length === 1 )
                            {
                                populateRolesDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateRolesDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting role:', error);
                            alert('An error occurred while deleting the role.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, roles, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: roles.length,
                container: container,
                onPageChange: (newPage) => populateRolesDataTable(newPage)
            }
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
}