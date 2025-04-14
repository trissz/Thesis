function addCanvasControlPanel(container)
{
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('canvas_control_panel_fieldset');
    fieldset.setAttribute('id', 'canvas_control_panel_fieldset');

    const legend = document.createElement('legend');
    legend.textContent = 'Canvas control Panel';
    fieldset.appendChild(legend);

    const playButton = document.createElement('button');
    playButton.classList.add('control_btn');
    playButton.setAttribute('id', 'play_btn');
    playButton.textContent = 'Play';
    playButton.addEventListener('click', () => window.visualizationController.play());
    fieldset.appendChild(playButton);

    const pauseButton = document.createElement('button');
    pauseButton.classList.add('control_btn');
    pauseButton.setAttribute('id', 'pause_btn');
    pauseButton.textContent = 'Pause';
    pauseButton.addEventListener('click', () => window.visualizationController.pause());
    fieldset.appendChild(pauseButton);

    const stepForwardButton = document.createElement('button');
    stepForwardButton.classList.add('control_btn');
    stepForwardButton.setAttribute('id', 'step_forward_btn');
    stepForwardButton.textContent = 'Step Forward';
    stepForwardButton.addEventListener('click', () => window.visualizationController.stepForward());
    fieldset.appendChild(stepForwardButton);

    const resetButton = document.createElement('button');
    resetButton.classList.add('control_btn');
    resetButton.setAttribute('id', 'reset_btn');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => window.visualizationController.reset());
    fieldset.appendChild(resetButton);

    const speedSlider = document.createElement('input');
    speedSlider.classList.add('control_slider');
    speedSlider.setAttribute('id', 'speed_slider');
    speedSlider.type = 'range';
    speedSlider.min = 1;
    speedSlider.max = 300;
    speedSlider.value = 150;
    speedSlider.addEventListener('input', (e) => {
        const newSpeed = parseInt(e.target.value);
        window.visualizationController.changeSpeed(newSpeed);
    });

    fieldset.appendChild(speedSlider);
    container.appendChild(fieldset);
}

function scriptAddition()
{
    return (`
        window.visualizationController = {
            isPlaying: true,
            frameSpeed: 60,
            play: () => loop(),
            pause: () => noLoop(),
            stepForward: () => redraw(),
            reset: () => {
                setup();
                loop();
            },
            changeSpeed: (newSpeed) => {
                frameRate(newSpeed);
                window.visualizationController.frameSpeed = newSpeed;
            }
        };

        function windowResized()
        {
            resizeCanvas(Utility.getElementWidth(canvasContainer), Utility.getElementHeight(canvasContainer));
        }
        
        if ( typeof setup === 'function' )
        {
            window.visualizationController = window.visualizationController || {};
            window.visualizationController.reset = setup;
            window.visualizationController.stepForward = () => redraw();
            window.visualizationController.play = () => loop();
            window.visualizationController.pause = () => noLoop();
            window.visualizationController.changeSpeed = (speed) => frameRate(speed);
        }
    `);
}