function makePagination(paginationOptions)
{
    const paginationControls = document.createElement('div');
    paginationControls.classList.add('pagination');

    const prevButton = document.createElement('button');
    prevButton.classList.add('pagination_btn');
    prevButton.textContent = 'Previous';
    prevButton.disabled = paginationOptions.currentPage === 1;
    prevButton.onclick = () => paginationOptions.onPageChange(paginationOptions.currentPage - 1);
    paginationControls.appendChild(prevButton);

    const currentPageSpan = document.createElement('span');
    currentPageSpan.textContent = `Page ${paginationOptions.currentPage}`;
    paginationControls.appendChild(currentPageSpan);

    const totalPageSpan = document.createElement('span');
    totalPageSpan.textContent = ` / ${paginationOptions.totalPages}`;
    paginationControls.appendChild(totalPageSpan);

    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination_btn');
    nextButton.textContent = 'Next';
    nextButton.disabled = paginationOptions.dataLength < paginationOptions.itemsPerPage;
    nextButton.onclick = () => paginationOptions.onPageChange(paginationOptions.currentPage + 1);
    paginationControls.appendChild(nextButton);

    paginationOptions.container.appendChild(paginationControls);
}