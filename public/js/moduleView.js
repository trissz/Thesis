document.addEventListener('DOMContentLoaded', async () => {
    const module = await getModuleData();
    const lessons = await getModuleLessonsData(module.id);
    const container = document.getElementById('module_view_container');

    /*What phase
    const totalConcepts = lessons.reduce((total, lesson) => total + lesson.concepts.length, 0);
    const completedLessons = lessons.filter(lesson => lesson.isActive).length;
    const completionPercentage = Math.floor((completedLessons / lessons.length) * 100);
    const complexityBadge = module.complexity === 'beginner' ? '🟢 Beginner' : module.complexity === 'intermediate' ? '🟡 Intermediate' : '🔴 Advanced';*/

    await loadModule();

    async function getModuleData()
    {
        const moduleId = parseInt(window.location.pathname.split('/').pop());

        if ( !Number.isInteger(moduleId) )
        {
            throw new Error('Module ID is not an integer number');
        }

        const response = await getDetailedModuleById(moduleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch module');
        }

        return response.data;
    }

    async function getModuleLessonsData(moduleId)
    {
        if ( !Number.isInteger(moduleId) )
        {
            throw new Error('Module ID is not an integer number');
        }
        
        const response = await getDetailedLessonsAllByModuleId(moduleId);

        if ( !response.success )
        {
            throw new Error('Failed to fetch lessons for module');
        }

        return response.data;
    }

    async function loadModule()
    {
        const totalSeconds = lessons.reduce((total, lesson) => total + lesson.estimatedTimeValue * lesson.timeUnitSecondsEquivalent, 0);
        const completionPercentage = 67;
        const completedLessons = 3;
        const totalConcepts = 10;
        const complexityBadge = '🟢 Beginner';

        container.innerHTML = `
            <div class="module_view_content_container">
                <header class="module_header">
                    <div class="module_meta">
                        <span class="data_pill module_status ${module.isActive ? 'active' : 'inactive'}">${module.isActive ? 'Active': 'Inactive'}</span>
                        <span class="module_date">Created: ${formatDate(module.createdAt)}</span>
                    </div>
                    
                    <h1 class="view_heading">${module.title}</h1>
                    
                    <div class="module_stats">
                        <div class="module_stat_item">
                            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6m0 0V5m0 8h6m-6 0H9m6 6v-6m0 0V5m0 8h6m-6 0h-6M3 21h18a1 1 0 001-1V4a1 1 0 00-1-1H3a1 1 0 00-1 1v16a1 1 0 001 1z"/>
                            </svg>
                            
                            <span>This module contains ${lessons.length} Lesson${lessons.length > 1 ? 's' : ''}</span>
                        </div>

                        <div class="module_stat_item">
                            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            
                            <span>~${formatTotalTime(totalSeconds)}</span>
                        </div>
                    </div>
                    
                    <div class="module_description">
                        <p class="view_text">${module.description}</p>
                    </div>
                </header>

                <h3>Progression</h3>

                <div class="progress_tracker animate_fade_in">
                    <div class="progress_bar_base">
                        <div class="progress_bar" style="width: ${completionPercentage}%"></div>
                    </div>

                    <div class="progress_labels">
                        <span class="progress_label_text">${completedLessons} / ${lessons.length} completed</span>
                        <span class="progress_label_text">${completionPercentage}% / 100%</span>
                    </div>
                </div>

                <div class="lesson_container">
                    ${lessons.map(lesson => `
                        <div class="lesson_card">
                            <article class="lesson_card_content">
                                <header class="lesson_header">
                                    <div class="lesson_meta">
                                        <span class="lesson_number">Lesson #${lesson.id}</span>
                                        <span class="data_pill lesson_status ${lesson.isActive ? 'active' : 'inactive'}">${lesson.isActive ? 'Active' : 'Draft'}</span>
                                    </div>

                                    <h2 class="view_subheading">${lesson.title}</h2>
                                </header>

                                <div class="lesson_stats">
                                    <div class="lesson_stat_item">
                                        <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        
                                        <span>~${lesson.estimatedTimeValue} ${lesson.timeUnitName}${lesson.estimatedTimeValue > 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div class="lesson_content_preview">${/*truncateText(lesson.content, 120)*/lesson.content}</div>
                            </article>

                            <div class="lesson_card_footer">
                                <button class="lesson_view_btn" onclick="window.location.href = '/lesson/view/${lesson.id}';">Start this lesson →</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`
        ;
    }
});

function truncateText(html, length)
{
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || '';
    return text.slice(0, length) + ( text.length > length ? '...' : '' );
};