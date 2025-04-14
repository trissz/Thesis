document.addEventListener('DOMContentLoaded', async () => {
    const lesson = await getLessonData();

    await loadLesson();

    document.getElementById('finish_lesson_btn').addEventListener('click', () => {
        showConfirmationPanel(
            `Are you sure you want to finish this lesson?`,
            async () => {
                try {
                    await markLessonAsCompleted();
                } catch ( error ) {
                    console.error('Error ..... :', error);
                    alert('An error occurred while ..... .');
                }
            },
            () => {}
        );
    });

    async function getLessonData()
    {
        const lessonId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(lessonId) )
        {
            throw new Error('Lesson ID is not an integer number');
        }

        const response = await getDetailedLessonById(lessonId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch lesson');
        }

        return response.data;
    }

    async function getModuleData(moduleId)
    {
        if ( !Number.isInteger(moduleId) )
        {
            throw new Error('Module ID is not an integer number');
        }
        
        const response = await getDetailedLessonById(moduleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch module');
        }

        return response.data;
    }

    async function loadLesson()
    {
        const module = await getModuleData(lesson.moduleId);
        const contentContainer = document.getElementById('lesson_content');

        document.getElementById('lesson_title').textContent = lesson.title;
        document.getElementById('module_title').textContent = module.title;
        document.getElementById('lesson_estimated_time_value').textContent = `~${lesson.estimatedTimeValue} ${lesson.timeUnitName}${lesson.estimatedTimeValue > 1 ? 's' : ''}`;

        const iframe = document.createElement('iframe');
        contentContainer.innerHTML = '';
        contentContainer.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();

        iframeDoc.write(`
            <html>
                <head>
                    <link rel="stylesheet" href="/css/lessonContent.css">
                </head>
                <body>
                    <div class="content-wrapper">${lesson.content}</div>
                </body>
            </html>
        `);

        iframeDoc.close();

        function adjustIframeHeight()
        {
            iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        }

        iframe.onload = adjustIframeHeight;
        setTimeout(adjustIframeHeight, 100);
    }
});