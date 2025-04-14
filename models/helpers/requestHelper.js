class RequestHelper
{
    static projectName = '';
    static port = 3001;
    static urlRoot = '';
    static urlDomain = 'http://pti.unithe.hu:13001/';
    static fileRoot = '';

    static actorName = '';
    static actorAction = '';

    static initialize({
        projectName,
        fileRoot,
        actorName,
        actorAction,
    })
    {
        this.projectName = projectName || '';
        this.fileRoot = fileRoot || '';
        this.actorName = actorName || '';
        this.actorAction = actorAction || '';

        this.urlRoot = `${this.urlDomain}`;
    }

    static reset()
    {
        this.projectName = '';
        this.fileRoot = '';
        this.urlRoot = '';
        this.actorName = '';
        this.actorAction = '';
    }
}

module.exports = RequestHelper;