document.addEventListener('DOMContentLoaded', async () => {
    await loadVisualization();
    addCanvasControlPanel(document.getElementById('visualization_view_container'));
});

async function getVisualizationData()
{
    const visualizationId = parseInt(window.location.pathname.split('/').pop());

    if ( !Number.isInteger(visualizationId) )
    {
        throw new Error('Visualization ID is not an integer number');
    }

    const response = await getDetailedVisualizationById(visualizationId);

    if ( !response.success )
    {
        throw new Error('Failed to fetch visualization');
    }

    return response.data;
}

async function loadVisualization()
{
    const visualization = await getVisualizationData();
    const container = document.getElementById('visualization_view_container');
    const canvasContainer = document.getElementById('canvas_container');
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('canvas_loading_spinner');
    loadingContainer.style.scale = '3';
    canvasContainer.appendChild(loadingContainer);

    const infoContainer = document.createElement('div');
    infoContainer.setAttribute('id', 'info_container');
    container.appendChild(infoContainer);

    document.getElementById('title').textContent = visualization.title;
    document.getElementById('description').textContent = visualization.description;

    try {
        const script = document.createElement('script');

        script.textContent = `
            ${visualization.scriptCode}
            ${scriptAddition()}
        `;

        canvasContainer.removeChild(loadingContainer);
        container.appendChild(script);
        MessageSystem.append('info', 'Use the canvas control panel to affect the visualization process.', infoContainer, false);
    } catch ( error ) {
        console.error('Error running the P5.js script:', error);
        MessageSystem.append('error', 'The visualization could not load. Try to refresh the page.', infoContainer, false);
    }
}

/*async function loadVisualization()
{
    const visualization = await getVisualizationData();
    const container = document.getElementById('visualization_view_container');
    const canvasContainer = document.getElementById('canvas_container');
    
    if ( !window.p5 )
    {
        await loadP5Dependencies();
    }

    if ( window.p5Sketch )
    {
        window.p5Sketch.remove();
    }

    const sketchContainer = document.createElement('div');
    sketchContainer.id = 'p5-sketch-container';
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(sketchContainer);

    const sketch = function(p) {
        p.setup = () => {
            p.createCanvas(800, 600).parent('p5-sketch-container');
            // setup code
        };

        p.draw = () => {
            // draw code
        };
    };

    window.p5Sketch = new p5(sketch);

    window.addEventListener('beforeunload', () => {
        if ( window.p5Sketch )
        {
            window.p5Sketch.remove();
        }
    });
}

async function loadP5Dependencies()
{
    return new Promise((resolve, reject) => {
        if ( window.p5 ) return resolve();

        const p5Script = document.createElement('script');
        p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js';
        p5Script.integrity = 'sha512-N4kV7GkNv7QR7RX9YF/olywyIgIwNvfEe2nZtfyj73HdjCUkAfOBDbcuJ/cTaN04JKRnw1YG1wnUyNKMsNgg3g==';
        p5Script.crossOrigin = 'anonymous';
        p5Script.referrerPolicy = 'no-referrer';

        const p5DomScript = document.createElement('script');
        p5DomScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.dom.min.js';

        p5Script.onload = () => {
            document.head.appendChild(p5DomScript);
            p5DomScript.onload = resolve;
        };
        
        p5Script.onerror = reject;
        document.head.appendChild(p5Script);
    });
}*/