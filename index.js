var esprima   = require('esprima'),
    escodegen = require('escodegen'),
    fs        = require('fs'),
    path      = require('path'),
    contents  = void(0),
    generated = void(0),
    //file      = process.argv.slice(2).shift(),
    escgopts  = {
        comment: true,
        format: {
            indent: {
                style: '    '
            },
            quotes: 'single'
        }
    };

module.exports = function (file) {
    if (file == null) {
        console.error('jsregenerate: No file specified');
        process.exit(1);
    }

    file = path.resolve(file);

    fs.exists(file, function (stat) {
        if (!stat) {
            console.error('jsregenerate: File not exists');
            process.exit(1);
        }
    });

    contents = fs.readFileSync(file);

    try {
        contents = esprima.parse(contents, {
            raw: true,
            tokens: true,
            range: true,
            comment: true
        });

        contents = escodegen.attachComments(contents, contents.comments, contents.tokens);

        generated = escodegen.generate(contents, escgopts);
    } catch (e) {
        console.error('jsregenerate: Error: ' + e.toString());
        process.exit(1);
    }

    console.log(generated);
}
