const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const RequestHelper = require('./models/helpers/requestHelper');
const LogHelper = require('./models/helpers/logHelper');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());

RequestHelper.initialize({
    projectName: 'Thesis',
    fileRoot: process.cwd(),
    actorName: 'Admin',
    actorAction: 'Debug',
});

LogHelper.addMessage('Project name: ' + RequestHelper.projectName);
LogHelper.addMessage('URL domain: ' + RequestHelper.urlDomain);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('indexView', {
        title: 'Home Page',
        pageStyles: ['index'],
        pageScripts: ['index'],
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || '976c8a396ac79699c3b13ee71f92e993c8ef62d92c96e59c1c8449944df66b8f86240c4a2ad2c9f42e641b58e08faf3f166289b8db136643968283fc4b38d291',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, //TODO: set to true in production //secure: process.env.NODE_ENV === 'production'
            maxAge: 2 * 60 * 60 * 1000, //2 hours
        },
    })
);

app.use(require('./routes/logRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/role', require('./routes/roleRoutes'));
app.use('/task-difficulty-level', require('./routes/taskDifficultyLevelRoutes'));
app.use('/task-type', require('./routes/taskTypeRoutes'));
app.use('/task', require('./routes/taskRoutes'));
app.use('/sort-based-task', require('./routes/sortBasedTaskRoutes'));
app.use('/select-based-task', require('./routes/selectBasedTaskRoutes'));
app.use('/input-based-task', require('./routes/inputBasedTaskRoutes'));
app.use('/time-unit', require('./routes/timeUnitRoutes'));
app.use('/module', require('./routes/moduleRoutes'));
app.use('/lesson', require('./routes/lessonRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));
app.use('/operation', require('./routes/operationRoutes'));
app.use('/permission', require('./routes/permissionRoutes'));
app.use('/achievement', require('./routes/achievementRoutes'));
app.use('/achievement-category', require('./routes/achievementCategoryRoutes'));
app.use('/code-language', require('./routes/codeLanguageRoutes'));
app.use('/algorithm', require('./routes/algorithmRoutes'));
app.use('/algorithm-category', require('./routes/algorithmCategoryRoutes'));
app.use('/algorithm-difficulty-level', require('./routes/algorithmDifficultyLevelRoutes'));
app.use('/algorithm-complexity', require('./routes/algorithmComplexityRoutes'));
app.use('/algorithm-implementation', require('./routes/algorithmImplementationRoutes'));
app.use('/visualization', require('./routes/visualizationRoutes'));
app.use('/multimedia', require('./routes/multimediaRoutes'));
app.use('/multimedia-category', require('./routes/multimediaCategoryRoutes'));

app.listen(RequestHelper.port, () => {
    console.log(`Server running at ${RequestHelper.urlDomain}`);
});