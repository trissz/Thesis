function generateTable(container, data, columns, options = {})
{
    container.innerHTML = '';

    if ( data.length === 0 )
    {
        const emptyState = document.createElement('div');
        emptyState.classList.add('empty_state');

        const message = document.createElement('p');
        message.textContent = options.emptyMessage || 'No data available.';
        emptyState.appendChild(message);

        container.appendChild(emptyState);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('entity_table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.header;
        headerRow.appendChild(th);
    });

    if ( options.actions )
    {
        const th = document.createElement('th');
        th.textContent = 'Actions';
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach(item => {
        const row = document.createElement('tr');

        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column.key] || '';
            row.appendChild(td);
        });

        if ( options.actions )
        {
            const actionTd = document.createElement('td');
            actionTd.classList.add('action_table_cell');
            
            options.actions.forEach(action => {
                const button = document.createElement('button');
                button.textContent = action.label;
                button.onclick = () => action.callback(item);
                actionTd.appendChild(button);
            });

            row.appendChild(actionTd);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    if ( options.pagination )
    {
        makePagination(options.pagination);
    }
}