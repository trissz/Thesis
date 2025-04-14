async function fetchData(url)
{
    try {
        const response = await fetch(url);

        if ( !response.ok )
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');

        if ( contentType.includes('application/json') )
        {
            return await response.json();
        }
        else
        {
            return await response.text();
        }
    } catch ( error ) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}

async function deleteRecord(url)
{
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if ( !response.ok )
        {
            throw new Error(`Failed to delete record. HTTP status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');

        if ( contentType && contentType.includes('application/json') )
        {
            return await response.json();
        }
        else
        {
            return await response.text();
        }
    } catch ( error ) {
        console.error('Error deleting record:', error);
        throw error;
    }
}

/* Log */

function getLogs()
{
    return fetchData('/logs');
}

/* User */

function getUsersAll()
{
    return fetchData('/user/get/all');
}

function getUsersPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/user/get/paginated?page=${page}&limit=${limit}`);
}

function getUserById(id)
{
    return fetchData(`/user/get/${id}`);
}

function getDetailedUsersAll()
{
    return fetchData('/user/get/detailed/all');
}

function getDetailedUsersPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/user/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedUserById(id)
{
    return fetchData(`/user/get/detailed/${id}`);
}

/* Feedback */

function getFeedbackAll()
{
    return fetchData('/feedback/get/all');
}

function getFeedbackPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/feedback/get/paginated?page=${page}&limit=${limit}`);
}

function getFeedbackById(id)
{
    return fetchData(`/feedback/get/${id}`);
}

function getDetailedFeedbackAll()
{
    return fetchData('/feedback/get/detailed/all');
}

function getDetailedFeedbackPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/feedback/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedFeedbackById(id)
{
    return fetchData(`/feedback/get/detailed/${id}`);
}

/* Visualization */

function getVisualizationsAll()
{
    return fetchData('/visualization/get/all');
}

function getVisualizationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/visualization/get/paginated?page=${page}&limit=${limit}`);
}

function getVisualizationById(id)
{
    return fetchData(`/visualization/get/${id}`);
}

function getDetailedVisualizationsAll()
{
    return fetchData('/visualization/get/detailed/all');
}

function getDetailedVisualizationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/visualization/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedVisualizationById(id)
{
    return fetchData(`/visualization/get/detailed/${id}`);
}

/* Time unit */

function getTimeUnitsAll()
{
    return fetchData('/time-unit/get/all');
}

function getTimeUnitsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/time-unit/get/paginated?page=${page}&limit=${limit}`);
}

function getTimeUnitById(id)
{
    return fetchData(`/time-unit/get/${id}`);
}

function getDetailedTimeUnitsAll()
{
    return fetchData('/time-unit/get/detailed/all');
}

function getDetailedTimeUnitsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/time-unit/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedTimeUnitById(id)
{
    return fetchData(`/time-unit/get/detailed/${id}`);
}

/* Task */

function getTasksAll()
{
    return fetchData('/task/get/all');
}

function getTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task/get/paginated?page=${page}&limit=${limit}`);
}

function getTaskById(id)
{
    return fetchData(`/task/get/${id}`);
}

function getDetailedTasksAll()
{
    return fetchData('/task/get/detailed/all');
}

function getDetailedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedTaskById(id)
{
    return fetchData(`/task/get/detailed/${id}`);
}

/* Task difficulty level */

function getTaskDifficultyLevelsAll()
{
    return fetchData('/task-difficulty-level/get/all');
}

function getTaskDifficultyLevelsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task-difficulty-level/get/paginated?page=${page}&limit=${limit}`);
}

function getTaskDifficultyLevelById(id)
{
    return fetchData(`/task-difficulty-level/get/${id}`);
}

function getDetailedTaskDifficultyLevelsAll()
{
    return fetchData('/task-difficulty-level/get/detailed/all');
}

function getDetailedTaskDifficultyLevelsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task-difficulty-level/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedTaskDifficultyLevelById(id)
{
    return fetchData(`/task-difficulty-level/get/detailed/${id}`);
}

/* Task type */

function getTaskTypesAll()
{
    return fetchData('/task-type/get/all');
}

function getTaskTypesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task-type/get/paginated?page=${page}&limit=${limit}`);
}

function getTaskTypeById(id)
{
    return fetchData(`/task-type/get/${id}`);
}

function getDetailedTaskTypesAll()
{
    return fetchData('/task-type/get/detailed/all');
}

function getDetailedTaskTypesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/task-type/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedTaskTypeById(id)
{
    return fetchData(`/task-type/get/detailed/${id}`);
}

/* Sort based task */

function getSortBasedTasksAll()
{
    return fetchData('/sort-based-task/get/all');
}

function getSortBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/sort-based-task/get/paginated?page=${page}&limit=${limit}`);
}

function getSortBasedTaskById(id)
{
    return fetchData(`/sort-based-task/get/${id}`);
}

function getDetailedSortBasedTasksAll()
{
    return fetchData('/sort-based-task/get/detailed/all');
}

function getDetailedSortBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/sort-based-task/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedSortBasedTaskById(id)
{
    return fetchData(`/sort-based-task/get/detailed/${id}`);
}

/* Select based task */

function getSelectBasedTasksAll()
{
    return fetchData('/select-based-task/get/all');
}

function getSelectBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/select-based-task/get/paginated?page=${page}&limit=${limit}`);
}

function getSelectBasedTaskById(id)
{
    return fetchData(`/select-based-task/get/${id}`);
}

function getDetailedSelectBasedTasksAll()
{
    return fetchData('/select-based-task/get/detailed/all');
}

function getDetailedSelectBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/select-based-task/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedSelectBasedTaskById(id)
{
    return fetchData(`/select-based-task/get/detailed/${id}`);
}

/* Input based task */

function getInputBasedTasksAll()
{
    return fetchData('/input-based-task/get/all');
}

function getInputBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/input-based-task/get/paginated?page=${page}&limit=${limit}`);
}

function getInputBasedTaskById(id)
{
    return fetchData(`/input-based-task/get/${id}`);
}

function getDetailedInputBasedTasksAll()
{
    return fetchData('/input-based-task/get/detailed/all');
}

function getDetailedInputBasedTasksPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/input-based-task/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedInputBasedTaskById(id)
{
    return fetchData(`/input-based-task/get/detailed/${id}`);
}

/* Permission */

function getPermissionsAll()
{
    return fetchData('/permission/get/all');
}

function getPermissionsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/permission/get/paginated?page=${page}&limit=${limit}`);
}

function getPermissionById(id)
{
    return fetchData(`/permission/get/${id}`);
}

function getDetailedPermissionsAll()
{
    return fetchData('/permission/get/detailed/all');
}

function getDetailedPermissionsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/permission/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedPermissionById(id)
{
    return fetchData(`/permission/get/detailed/${id}`);
}

function getPermissionsByRoleId(roleId)
{
    return fetchData(`/permission/get/all/by/role-id/${roleId}`);
}

/* Operation */

function getOperationsAll()
{
    return fetchData('/operation/get/all');
}

function getOperationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/operation/get/paginated?page=${page}&limit=${limit}`);
}

function getOperationById(id)
{
    return fetchData(`/operation/get/${id}`);
}

function getDetailedOperationsAll()
{
    return fetchData('/operation/get/detailed/all');
}

function getDetailedOperationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/operation/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedOperationById(id)
{
    return fetchData(`/operation/get/detailed/${id}`);
}

/* Multimedia */

function getMultimediaAll()
{
    return fetchData('/multimedia/get/all');
}

function getMultimediaPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/multimedia/get/paginated?page=${page}&limit=${limit}`);
}

function getMultimediaById(id)
{
    return fetchData(`/multimedia/get/${id}`);
}

function getDetailedMultimediaAll()
{
    return fetchData('/multimedia/get/detailed/all');
}

function getDetailedMultimediaPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/multimedia/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedMultimediaById(id)
{
    return fetchData(`/multimedia/get/detailed/${id}`);
}

/* Multimedia category */

function getMultimediaCategoriesAll()
{
    return fetchData('/multimedia-category/get/all');
}

function getMultimediaCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/multimedia-category/get/paginated?page=${page}&limit=${limit}`);
}

function getMultimediaCategoryById(id)
{
    return fetchData(`/multimedia-category/get/${id}`);
}

function getDetailedMultimediaCategoriesAll()
{
    return fetchData('/multimedia-category/get/detailed/all');
}

function getDetailedMultimediaCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/multimedia-category/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedMultimediaCategoryById(id)
{
    return fetchData(`/multimedia-category/get/detailed/${id}`);
}

/* Module */

function getModulesAll()
{
    return fetchData('/module/get/all');
}

function getModulesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/module/get/paginated?page=${page}&limit=${limit}`);
}

function getModuleById(id)
{
    return fetchData(`/module/get/${id}`);
}

function getModuleLessonsAllByModuleId(moduleId)
{
    return fetchData(`/module/get/all/lesson/by/id/${moduleId}`);
}

function getDetailedModulesAll()
{
    return fetchData('/module/get/detailed/all');
}

function getDetailedModulesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/module/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedModuleById(id)
{
    return fetchData(`/module/get/detailed/${id}`);
}

function getDetailedModuleLessonsAllByModuleId(moduleId)
{
    return fetchData(`/module/get/detailed/all/lesson/by/id/${moduleId}`);
}

/* Lesson */

function getLessonsAll()
{
    return fetchData('/lesson/get/all');
}

function getLessonsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/lesson/get/paginated?page=${page}&limit=${limit}`);
}

function getLessonById(id)
{
    return fetchData(`/lesson/get/${id}`);
}

function getLessonsAllByModuleId(moduleId)
{
    return fetchData(`/lesson/get/all/by/module-id/${moduleId}`);
}

function getDetailedLessonsAll()
{
    return fetchData('/lesson/get/detailed/all');
}

function getDetailedLessonsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/lesson/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedLessonById(id)
{
    return fetchData(`/lesson/get/detailed/${id}`);
}

function getDetailedLessonsAllByModuleId(moduleId)
{
    return fetchData(`/lesson/get/detailed/all/by/module-id/${moduleId}`);
}

/* Code language */

function getCodeLanguagesAll()
{
    return fetchData('/code-language/get/all');
}

function getCodeLanguagesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/code-language/get/paginated?page=${page}&limit=${limit}`);
}

function getCodeLanguageById(id)
{
    return fetchData(`/code-language/get/${id}`);
}

function getDetailedCodeLanguagesAll()
{
    return fetchData('/code-language/get/detailed/all');
}

function getDetailedCodeLanguagesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/code-language/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedCodeLanguageById(id)
{
    return fetchData(`/code-language/get/detailed/${id}`);
}

/* Algorithm */

function getAlgorithmsAll()
{
    return fetchData('/algorithm/get/all');
}

function getAlgorithmsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm/get/paginated?page=${page}&limit=${limit}`);
}

function getAlgorithmById(id)
{
    return fetchData(`/algorithm/get/${id}`);
}

function getDetailedAlgorithmsAll()
{
    return fetchData('/algorithm/get/detailed/all');
}

function getDetailedAlgorithmsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAlgorithmById(id)
{
    return fetchData(`/algorithm/get/detailed/${id}`);
}

/* Algorithm difficulty level */

function getAlgorithmDifficultyLevelsAll()
{
    return fetchData('/algorithm-difficulty-level/get/all');
}

function getAlgorithmDifficultyLevelsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-difficulty-level/get/paginated?page=${page}&limit=${limit}`);
}

function getAlgorithmDifficultyLevelById(id)
{
    return fetchData(`/algorithm-difficulty-level/get/${id}`);
}

function getDetailedAlgorithmDifficultyLevelsAll()
{
    return fetchData('/algorithm-difficulty-level/get/detailed/all');
}

function getDetailedAlgorithmDifficultyLevelsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-difficulty-level/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAlgorithmDifficultyLevelById(id)
{
    return fetchData(`/algorithm-difficulty-level/get/detailed/${id}`);
}

/* Algorithm complexity */

function getAlgorithmComplexitiesAll()
{
    return fetchData('/algorithm-complexity/get/all');
}

function getAlgorithmComplexitiesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-complexity/get/paginated?page=${page}&limit=${limit}`);
}

function getAlgorithmComplexityById(id)
{
    return fetchData(`/algorithm-complexity/get/${id}`);
}

function getDetailedAlgorithmComplexitiesAll()
{
    return fetchData('/algorithm-complexity/get/detailed/all');
}

function getDetailedAlgorithmComplexitiesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-complexity/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAlgorithmComplexityById(id)
{
    return fetchData(`/algorithm-complexity/get/detailed/${id}`);
}

/* Algorithm category */

function getAlgorithmCategoriesAll()
{
    return fetchData('/algorithm-category/get/all');
}

function getAlgorithmCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-category/get/paginated?page=${page}&limit=${limit}`);
}

function getAlgorithmCategoryById(id)
{
    return fetchData(`/algorithm-category/get/${id}`);
}

function getDetailedAlgorithmCategoriesAll()
{
    return fetchData('/algorithm-category/get/detailed/all');
}

function getDetailedAlgorithmCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-category/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAlgorithmCategoryById(id)
{
    return fetchData(`/algorithm-category/get/detailed/${id}`);
}

/* Algorithm implementation */

function getAlgorithmImplementationsAll()
{
    return fetchData('/algorithm-implementation/get/all');
}

function getAlgorithmImplementationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-implementation/get/paginated?page=${page}&limit=${limit}`);
}

function getAlgorithmImplementationById(id)
{
    return fetchData(`/algorithm-implementation/get/${id}`);
}

function getDetailedAlgorithmImplementationsAll()
{
    return fetchData('/algorithm-implementation/get/detailed/all');
}

function getDetailedAlgorithmImplementationsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/algorithm-implementation/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAlgorithmImplementationById(id)
{
    return fetchData(`/algorithm-implementation/get/detailed/${id}`);
}

function getDetailedAlgorithmImplementationsAllByAlgoithmId(id)
{
    return fetchData(`/algorithm-implementation/get/detailed/all/by/algorithm-id/${id}`);
}

/* Achievement */

function getAchievementsAll()
{
    return fetchData('/achievement/get/all');
}

function getAchievementsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/achievement/get/paginated?page=${page}&limit=${limit}`);
}

function getAchievementById(id)
{
    return fetchData(`/achievement/get/${id}`);
}

function getDetailedAchievementsAll()
{
    return fetchData('/achievement/get/detailed/all');
}

function getDetailedAchievementsPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/achievement/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAchievementById(id)
{
    return fetchData(`/achievement/get/detailed/${id}`);
}

/* Achievement category */

function getAchievementCategoriesAll()
{
    return fetchData('/achievement-category/get/all');
}

function getAchievementCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/achievement-category/get/paginated?page=${page}&limit=${limit}`);
}

function getAchievementCategoryById(id)
{
    return fetchData(`/achievement-category/get/${id}`);
}

function getDetailedAchievementCategoriesAll()
{
    return fetchData('/achievement-category/get/detailed/all');
}

function getDetailedAchievementCategoriesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/achievement-category/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedAchievementCategoryById(id)
{
    return fetchData(`/achievement-category/get/detailed/${id}`);
}

/* Role */

function getRolesAll()
{
    return fetchData('/role/get/all');
}

function getRolesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/role/get/paginated?page=${page}&limit=${limit}`);
}

function getRoleById(id)
{
    return fetchData(`/role/get/${id}`);
}

function getDetailedRolesAll()
{
    return fetchData('/role/get/detailed/all');
}

function getDetailedRolesPaginated(page = paginationDataset.defaultCurrentPage, limit = paginationDataset.defaultItemsPerPage)
{
    return fetchData(`/role/get/detailed/paginated?page=${page}&limit=${limit}`);
}

function getDetailedRoleById(id)
{
    return fetchData(`/role/get/detailed/${id}`);
}