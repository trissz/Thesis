document.addEventListener('DOMContentLoaded', function() {
    loadFeedbackData();
});

async function getFeedbackData()
{
    const feedbackId = parseInt(window.location.pathname.split('/').pop());

    if ( Number.isInteger(feedbackId) )
    {
        const form = document.getElementById('feedback_update_form');

        if ( !form.action.endsWith(feedbackId.toString()) )
        {
            form.action += feedbackId;
        }
        
        const response = await getFeedbackById(feedbackId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch feedback');
        }

        return response.data;
    }
    else
    {
        throw new Error('Invalid feedback ID');
    }
}

async function loadFeedbackData()
{
    const feedback = await getFeedbackData();

    document.getElementById('topic').value = feedback.topic;
    document.getElementById('content').value = feedback.content;
    document.getElementById('is_active').checked = feedback.isActive;
}