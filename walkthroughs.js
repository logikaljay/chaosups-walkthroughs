var path = require('path');

module.exports = function(app) {
    // app.set('views', path.join(__dirname, 'cpklogs/views'));

    app.locals.plugins = app.locals.plugins || [];

    app.locals.plugins.push({
        text: "Walkthroughs",
        url: "/walkthroughs/list"
    });

    require('./walkthroughs/index.js')(app);
}