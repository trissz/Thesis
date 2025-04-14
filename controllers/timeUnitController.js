const TimeUnitBo = require('../models/bos/timeUnitBo');
const TimeUnitDo = require('../models/dos/timeUnitDo');
const TimeUnitDto = require('../models/dtos/timeUnitDto');
const HTTP_STATUS_CODES = require('../models/helpers/httpStatusCodes');
const LogHelper = require('../models/helpers/logHelper');
const UtilityHelper = require('../models/helpers/utilityHelper');
const timeUnitBo = new TimeUnitBo();

module.exports = {
    async createTimeUnit(req, res)
    {
        let timeUnitDo = new TimeUnitDo();

        timeUnitDo.name = req.body.name;
        timeUnitDo.notation = req.body.notation;
        timeUnitDo.secondsEquivalent = parseInt(req.body.seconds_equivalent);

        /*
        let timeUnitDo = new TimeUnitDo(req.body); //?
        */

        try {
            const result = await timeUnitBo.create(timeUnitDo);

            if ( result )
            {
                const timeUnitId = result[0]?.insertId || 'unknown';

                LogHelper.addConfirmation(`Time Unit created successfully: ID ${timeUnitId}, Name: ${timeUnitDo.name}`);
                return res.redirect('/time-unit/create');
            }
            else
            {
                LogHelper.addError('Cannot create time unit');

                return res.status(HTTP_STATUS_CODES.BAD_REQUEST).render('userCreateView', {
                    title: 'Create Time Unit',
                    message: 'Time Unit creation failed. Please try again.',
                    pageStyles: ['create', 'timeUnitCreate'],
                    pageScripts: ['timeUnitCreate'],
                });
            }
        } catch ( error )
        {
            LogHelper.addError(`Error creating time unit: ${error.message}`);

            if ( error.code === 'ER_DUP_ENTRY' )
            {
                return res.status(HTTP_STATUS_CODES.CONFLICT).render('timeUnitCreateView', {
                    title: 'Create Time Unit',
                    message: 'Time Unit name is already in use. Please try a different one.',
                    pageStyles: ['create', 'timeUnitCreate'],
                    pageScripts: ['timeUnitCreate'],
                });
            }
        }

        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('timeUnitCreateView', {
            title: 'Create Time Unit',
            message: 'An unexpected error occurred. Please try again later.',
            pageStyles: ['create', 'timeUnitCreate'],
            pageScripts: ['timeUnitCreate'],
        });
    },

    async updateTimeUnit(req, res)
    {
        let timeUnitDo = new TimeUnitDo();

        timeUnitDo.id = parseInt(req.params.id);
        timeUnitDo.name = req.body.name;
        timeUnitDo.notation = req.body.notation;
        timeUnitDo.secondsEquivalent = parseInt(req.body.seconds_equivalent);
        timeUnitDo.isActive = req.body.is_active == "on" ? 1 : 0;

        try {
            const result = await timeUnitBo.update(timeUnitDo);

            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Time unit updated successfully: ID ${timeUnitDo.id}, Name: ${timeUnitDo.name}`);
                return res.redirect(`/time-unit/update/${timeUnitDo.id}`);
            }
            else
            {
                LogHelper.addError(`Cannot update Time unit: ID ${timeUnitDo.id}`);

                return res.status(HTTP_STATUS_CODES.NOT_FOUND).render('timeUnitUpdateView', {
                    title: 'Update Time unit',
                    message: 'Time unit update failed. Time unit not found.',
                    pageStyles: ['update', 'timeUnitUpdate'],
                    pageScripts: ['timeUnitUpdate'],
                });
            }
        } catch ( error ) {
            LogHelper.addError(`Error updating Time unit: ${error.message}`);

            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).render('timeUnitUpdateView', {
                title: 'Update Time unit',
                message: 'An unexpected error occurred. Please try again later.',
                pageStyles: ['update', 'timeUnitUpdate'],
                pageScripts: ['timeUnitUpdate'],
            });
        }
    },

    async deleteTimeUnit(req, res)
    {
        const timeUnitId = parseInt(req.params.id);
    
        try {
            const result = await timeUnitBo.deleteById(timeUnitId);
    
            if ( result[0]?.affectedRows )
            {
                LogHelper.addConfirmation(`Time unit deleted successfully: ID ${timeUnitId}`);
                return res.status(HTTP_STATUS_CODES.OK).json({ success: true, message: 'Time unit deleted successfully.' });
            }
            else
            {
                LogHelper.addError(`Cannot delete Time unit: ID ${timeUnitId}`);
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ success: false, message: 'Time unit not found or already deleted.' });
            }
        } catch ( error ) {
            LogHelper.addError(`Error deleting Time unit: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    },

    async getTimeUnitById(req, res)
    {
        const timeUnitId = parseInt(req.params.id);

        try {
            const timeUnit = await timeUnitBo.getById(timeUnitId);
    
            if ( !timeUnit )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Time Unit not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: timeUnit,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching time unit: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the time unit.',
            });
        }
    },

    async getTimeUnitList(req, res)
    {
        try {
            const timeUnits = await timeUnitBo.getAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: timeUnits,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching time unit list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the time unit list.',
            });
        }
    },

    async getPaginatedTimeUnitList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const timeUnits = await timeUnitBo.getPaginated(page, limit);
            const total = await timeUnitBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${timeUnits.length} time units (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    timeUnits,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching paginated time units: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },

    async getDetailedTimeUnitById(req, res)
    {
        const timeUnitId = parseInt(req.params.id);

        try {
            const timeUnit = await timeUnitBo.getDetailedById(timeUnitId);
    
            if ( !timeUnit )
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    error: 'Time unit not found.',
                });
            }
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: timeUnit,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed time unit: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed time unit.',
            });
        }
    },

    async getDetailedTimeUnitList(req, res)
    {
        try {
            const timeUnits = await timeUnitBo.getDetailedAll();
    
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: timeUnits,
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed time unit list: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred while fetching the detailed time unit list.',
            });
        }
    },

    async getDetailedPaginatedTimeUnitList(req, res)
    {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
    
        try {
            const timeUnits = await timeUnitBo.getDetailedPaginated(page, limit);
            const total = await timeUnitBo.getCount();
    
            LogHelper.addConfirmation(`Fetched ${timeUnits.length} timeUnits (Page: ${page}, Limit: ${limit})`);
            return res.status(HTTP_STATUS_CODES.OK).json({
                success: true,
                data: {
                    timeUnits,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    total,
                },
            });
        } catch ( error ) {
            LogHelper.addError(`Error fetching detailed paginated time units: ${error.message}`);
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'An unexpected error occurred. Please try again later.',
            });
        }
    },
};