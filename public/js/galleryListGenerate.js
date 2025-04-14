function generateGalleryList(container, data, columns, entityUrl, options = {}) {
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

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        columns.forEach(column => {
            let parentElement = card;

            column.tags.forEach((tag, index) => {
                const element = document.createElement(tag);

                if ( index === column.tags.length - 1 )
                {
                    element.textContent = item[column.key];
                }

                parentElement.appendChild(element);
                parentElement = element;
            });
        });

        if ( entityUrl && item.id )
        {
            const viewLink = document.createElement('a');
            viewLink.textContent = "View →";
            viewLink.href = `/${entityUrl}/view/${item.id}`;
            viewLink.dataset.id = item.id;

            viewLink.addEventListener('click', (event) => {
                event.preventDefault();
                navigateToEntityView(entityUrl, item.id);
            });

            card.appendChild(viewLink);
        }
        else
        {
            const notAvailableParagraph = document.createElement('p');
            notAvailableParagraph.textContent = "View is currently not available";
            card.appendChild(notAvailableParagraph);
        }

        container.appendChild(card);
    });

    if ( options.pagination )
    {
        makePagination(options.pagination);
    }
}

function navigateToEntityView(entityUrl, id)
{
    window.location.href = `/${entityUrl}/view/${id}`;
}