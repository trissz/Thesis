class UtilityHelper
{
    static isset(variable)
    {
        return variable != null && variable !== '';
    }
}

module.exports = UtilityHelper;