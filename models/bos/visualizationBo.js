const VisualizationDao = require('../daos/visualizationDao');
const VisualizationDo = require('../dos/visualizationDo');
const VisualizationDto = require('../dtos/visualizationDto');
const LogHelper = require('../helpers/logHelper');
const UtilityHelper = require('../helpers/utilityHelper');
const ArrayHelper = require('../helpers/arrayHelper');

class VisualizationBo
{
    constructor()
    {
        this.visualizationDao = new VisualizationDao();
    }

    baseValidateFields(visualizationDo)
    {
        let isValid = true;

        const requiredFields = ArrayHelper.mergeUnique(VisualizationDo.requiredFields, ['title', 'description', 'scriptCode']);
        const missingFields = requiredFields.filter(field => !UtilityHelper.isset(visualizationDo[field]));

        if ( missingFields.length > 0 )
        {
            missingFields.forEach(field =>
                LogHelper.addError(`Missing required field: ${field}`)
            );
            
            isValid = false;
        }

        for ( const field of requiredFields )
        {
            if ( !UtilityHelper.isset(visualizationDo[field]) )
            {
                LogHelper.addError(`Invalid or undefined value for field "${field}": ${visualizationDo[field]}`);
                isValid = false;
            }
        }

        return isValid;
    }

    async create(visualizationDo)
    {
        return this.baseValidateFields(visualizationDo) ? await this.visualizationDao.create(visualizationDo) : null;
    }

    async getById(id)
    {
        return await this.visualizationDao.getById(id);
    }

    async getAll()
    {
        return await this.visualizationDao.getAll();
    }

    async getPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.visualizationDao.getPaginated(limit, offset);
    }

    async getDetailedById(id)
    {
        return await this.visualizationDao.getDetailedById(id);
    }

    async getDetailedAll()
    {
        return await this.visualizationDao.getDetailedAll();
    }

    async getDetailedPaginated(page, limit)
    {
        const offset = ( page - 1 ) * limit;
        return await this.visualizationDao.getDetailedPaginated(limit, offset);
    }

    async getCount()
    {
        return await this.visualizationDao.getCount();
    }

    async deleteById(id)
    {
        return await this.visualizationDao.deleteById(id);
    }

    async update(visualizationDo)
    {
        let isUpdateValid = true;

        if ( !UtilityHelper.isset(visualizationDo.id) )
        {
            LogHelper.addError('Visualization ID is required for update');
            isUpdateValid = false;
        }

        return isUpdateValid && this.baseValidateFields(visualizationDo) ? await this.visualizationDao.update(visualizationDo) : null;
    }
}

module.exports = VisualizationBo;