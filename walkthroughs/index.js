var fs = require('fs')
  , path = require('path');

module.exports = function(app) {
    app.get('/walkthroughs/list', app.libs.restrict, function(req, res) {
        _readWalkthroughsDataFile(function(walkthroughs) {
            res.render('../plugins/walkthroughs/views/list.ejs', { walkthroughs: walkthroughs.reverse() });
        });
    });

    app.get('/walkthroughs/view/:file', app.libs.restrict, function(req, res) {
        var file = req.params.file;
        fs.readFile(path.join(__dirname, 'upload', file), function(err, fileStr) {
            res.set('Content-Type', 'text/plain');
            res.send(fileStr);
        });
    });

    app.get('/walkthroughs/upload', app.libs.restrict, function(req, res) {
        res.render('../plugins/walkthroughs/views/upload.ejs')
    });

    app.post('/walkthroughs/upload', app.libs.restrict, function(req, res) {
        var title = req.body.title || "";
        var file = req.files.file;

        var upload = {
            title: title,
            file: file.originalFilename
        };
        
        console.log(path.join(__dirname, 'upload', file.originalFilename));

        fs.rename(file.path, path.join(__dirname, 'upload', file.originalFilename), function(err) {
            if (err) {
                throw err;
            }

            _readWalkthroughsDataFile(function(walkthroughs) {
                walkthroughs.push(upload);
                _writeWalkthroughsDataFile(walkthroughs, function() {
                    res.redirect('/walkthroughs/list');
                });
            });
        });
    });

    function _readWalkthroughsDataFile(fn) {
        var walkthroughs = [];
        try {
            walkthroughs = require(path.join(__dirname, 'walkthroughs.json'));
        } catch (e) {}

        fn(walkthroughs);
    }

    function _writeWalkthroughsDataFile(walkthroughs, fn) {
        fs.writeFile(path.join(__dirname, 'walkthroughs.json'), JSON.stringify(walkthroughs), function(err) {
            fn();
        });
    }
}