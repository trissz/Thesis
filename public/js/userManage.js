document.addEventListener('DOMContentLoaded', () => {
    populateUsersDataTable();
});

async function getUsersDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getUsersPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated users');
    }

    return response;
}

async function populateUsersDataTable(currentPage = paginationDataset.defaultCurrentPage)
{
    const container = document.getElementById('user_list_table_container');

    try {
        const response = await getUsersDataPaginated(currentPage, paginationDataset.defaultItemsPerPage);
        const { users, totalPages, totalRecords } = response.data;

        const columns = [
            { header: 'ID', key: 'id' },
            { header: 'Role ID', key: 'roleId' },
            { header: 'Name', key: 'name' },
            { header: 'Email', key: 'email' },
            { header: 'Is active', key: 'isActive' },
            { header: 'Created at', key: 'createdAt' },
            { header: 'Updated at', key: 'updatedAt' }
        ];

        const actions = [
            { label: 'Edit', callback: (user) => {window.location.href = `/user/update/${user.id}`;} },
            { label: 'Delete', callback: async (user) => {
                showConfirmationPanel(
                    `Are you sure you want to delete user ${user.name}?`,
                    async () => {
                        try {
                            await deleteRecord(`/user/delete/${user.id}`);
                            alert(`User ${user.name} deleted successfully.`);
                            
                            if ( currentPage > 1 && users.length === 1 )
                            {
                                populateUsersDataTable(currentPage - 1);
                            }
                            else
                            {
                                populateUsersDataTable(currentPage);
                            }
                        } catch ( error ) {
                            console.error('Error deleting user:', error);
                            alert('An error occurred while deleting the user.');
                        }
                    },
                    () => {
                        alert('Action cancelled.');
                    }
                );
            } }
        ];        

        generateTable(container, users, columns, {
            actions,
            pagination: {
                currentPage,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                dataLength: users.length,
                container: container,
                onPageChange: (newPage) => populateUsersDataTable(newPage)
            }
        });
    } catch ( error ) {
        console.error('Error fetching users:', error);
    }
}