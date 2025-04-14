document.addEventListener('DOMContentLoaded', async () => {
    const algorithm = await getAlgorithmData();
    const algorithmImplementations = await getAlgorithmImplementationsData(algorithm.id);

    await loadAlgorithm();
    await loadAlgorithmImplementations();

    async function getAlgorithmData()
    {
        const algorithmId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(algorithmId) )
        {
            throw new Error('Algorithm ID is not an integer number');
        }

        const response = await getDetailedAlgorithmById(algorithmId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm');
        }

        return response.data;
    }

    async function getAlgorithmImplementationsData(algorithmId)
    {
        if ( !Number.isInteger(algorithmId) )
        {
            throw new Error('Algorithm ID is not an integer number');
        }

        const response = await getDetailedAlgorithmImplementationsAllByAlgoithmId(algorithmId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch algorithm implementations');
        }

        return response.data;
    }

    async function loadAlgorithm()
    {
        document.getElementById('algorithm_category_name').textContent = algorithm.algorithmCategoryName;
        document.getElementById('algorithm_difficulty_level_name').dataset.difficulty = algorithm.algorithmDifficultyLevelName;
        document.getElementById('algorithm_difficulty_level_name').textContent = algorithm.algorithmDifficultyLevelName;
        document.getElementById('name').textContent = algorithm.name;
    }

    function loadAlgorithmImplementations()
    {
        const container = document.getElementById('algorithm_implementations_container');
        
        algorithmImplementations.forEach(algorithmImplementation => {
            const card = document.createElement('div');
            card.className = 'algorithm_implementation_card';
            
            card.innerHTML = `
                <div class="algorithm_implementation_header">
                    <div class="algorithm_implementation_language">
                        <span class="language_icon">${algorithmImplementation.codeLanguageNotation}</span>
                        ${algorithmImplementation.codeLanguageName}
                    </div>
                    <span class="algorithm_implementation_complexity">${algorithmImplementation.algorithmComplexityNotation}</span>
                </div>
                
                <div class="algorithm_implementation_body">
                    <h3 class="algorithm_implementation_title">${algorithmImplementation.name}</h3>
                    <p class="algorithm_implementation_description">${algorithmImplementation.description}</p>
                    
                    <div class="code_block">
                        <pre>
                            <code>
                                ${trimCode(algorithmImplementation.code, {
                                    maxLines: 15,
                                    maxLineLength: 80,
                                    preserveIndentation: true
                                })}
                            </code>
                        </pre>
                    </div>

                    <div class="algorithm_implementation_card_footer">
                        <button class="view_action_btn" onclick="window.location.href = '/algorithm-implementation/view/${algorithmImplementation.id}';">View algorithm implementation</button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }

    function trimCode(code, options = {})
    {
        const defaults = {
            maxLines: 20,
            maxLineLength: 100,
            preserveIndentation: true,
            showEllipsis: true,
            trimWhitespace: true
        };
    
        const config = { ...defaults, ...options };
        const ellipsis = config.showEllipsis ? '…' : '';
        const lineCounter = config.showEllipsis ? `\n// … ${Math.max(0, code.split('\n').length - config.maxLines)} more lines` : '';
    
        return code.split('\n').slice(0, config.maxLines).map(line => {
            if ( config.trimWhitespace )
            {
                line = config.preserveIndentation ? line.trimEnd() : line.trim();
            }

            if ( line.length > config.maxLineLength )
            {
                return line.substring(0, config.maxLineLength) + ellipsis;
            }

            return line;
        }).join('\n').replace(/\n*$/, '') + lineCounter;
    }
});