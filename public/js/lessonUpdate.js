document.addEventListener('DOMContentLoaded', function() {
    loadLessonData();
});

async function getLessonData()
{
    const lessonId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(lessonId) )
    {
        const form = document.getElementById('lesson_update_form');

        if ( !form.action.endsWith(lessonId.toString()) )
        {
            form.action += lessonId;
        }
        
        const response = await getLessonById(lessonId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch lesson');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid lesson ID');
    }
}

async function loadLessonData()
{
    const lesson = await getLessonData();

    document.getElementById('module_id').value = lesson.moduleId;
    document.getElementById('time_unit_id').value = lesson.timeUnitId;
    document.getElementById('title').value = lesson.title;
    document.getElementById('content').value = lesson.content;
    document.getElementById('estimated_time_value').value = lesson.estimatedTimeValue;
    document.getElementById('is_active').checked = lesson.isActive;
}