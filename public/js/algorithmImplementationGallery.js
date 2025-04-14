document.addEventListener('DOMContentLoaded', async () => {
    await loadAlgorithmImplementationsData();
});

async function getAlgorithmImplementationsDataPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    const response = await getDetailedAlgorithmImplementationsPaginated(page, limit);

    if ( !response.success )
    {
        throw new Error('Failed to fetch paginated algorithm implementations');
    }

    return response.data;
}

let currentPage = paginationDataset.defaultCurrentPage;

async function loadAlgorithmImplementationsData(page = currentPage)
{
    const container = document.getElementById('algorithm_implementation_gallery_container');

    try {
        const { algorithmImplementations, totalPages, totalRecords } = await getAlgorithmImplementationsDataPaginated(page, paginationDataset.defaultItemsPerPage);
        container.innerHTML = '';

        algorithmImplementations.forEach(algorithmImplementation => {
            container.innerHTML += `
                <div class="algorithm_implementation_card">
                    <div class="card_header">

                        <div class="header_text">
                            <h3 class="algorithm_name">${algorithmImplementation.algorithmName}</h3>

                            <div class="meta_info">
                                <span class="algorithm_complexity_badge">${algorithmImplementation.algorithmComplexityNotation} 〔${algorithmImplementation.algorithmComplexityName}〕</span>
                                <span class="code_language_tag">${algorithmImplementation.codeLanguageName}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card_body">
                        <p class="algorithm_implementation_description">${algorithmImplementation.description}</p>

                        <div class="code_preview">
                            <pre><code class="code_language_${algorithmImplementation.codeLanguageKeyString}">${algorithmImplementation.code}</code></pre>
                        </div>
                    </div>
                    
                    <div class="card_footer">
                        <div class="status_indicator ${algorithmImplementation.isActive ? 'active' : 'inactive'}">
                            ${algorithmImplementation.isActive ? 'Active' : 'Inactive'}
                        </div>

                        <span class="algorithm_implementation_date">Created: ${formatDate(algorithmImplementation.createdAt)}</span>
                        <span class="algorithm_implementation_date">Last modified: ${formatDate(algorithmImplementation.updatedAt)}</span>
                    </div>

                    <button class="view_action_btn" onclick="window.location.href = '/algorithm-implementation/view/${algorithmImplementation.id}';">View algorithm implementation</button>
                </div>
            `;
        });

        const pagination = {
            currentPage: page,
            totalPages,
            totalRecords,
            itemsPerPage: paginationDataset.defaultItemsPerPage,
            dataLength: algorithmImplementations.length,
            container: container,
            onPageChange: (newPage) => loadAlgorithmImplementationsData(newPage)
        }

        makePagination(pagination);

        /*const columns = [
            { header: 'Algorithm name', key: 'algorithmName', tags: ['p'] },
            { header: 'Code language name', key: 'codeLanguageName', tags: ['p'] },
            { header: 'Code language notation', key: 'codeLanguageNotation', tags: ['p'] },
            { header: 'Algorithm complexity notation', key: 'algorithmComplexityNotation', tags: ['p'] },
            { header: 'Name', key: 'name', tags: ['p'] },
            { header: 'Created at', key: 'createdAt', tags: ['p', 'small'] }
        ];

        generateGalleryList(container, algorithmImplementations, columns, "algorithm-implementation", {
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                itemsPerPage: paginationDataset.defaultItemsPerPage,
                onPageChange: (newPage) => loadAlgorithmImplementationsData(newPage)
            }
        });*/

        currentPage = page;
    } catch ( error ) {
        console.error('Error fetching algorithm implementations:', error);
    }
}