var esprima   = require('esprima'),
    escodegen = require('escodegen'),
    fs        = require('fs'),
    path      = require('path'),
    escgOpts  = {
        comment: true,
        format: {
            indent: {
                style: '    ',
                adjustMultilineComment: true
            },
            quotes: 'single',
            preserveBlankLines: true
        }
    };

module.exports = function (opts) {
    var files = opts.file || [];

    if (files.length === 0) {
        throw new Error('no files specified');
    }

    files = files.map(function (file) {
        return path.resolve(file);
    });

    files.forEach(function (file) {
        var source, ast, generated;

        //TODO Use vow-fs/Promises
        if (!fs.existsSync(file)) {
            throw new Error('' + file + ' not exist');
        }

        source = fs.readFileSync(file);

        try {
            ast = esprima.parse(source, {
                raw: true,
                tokens: true,
                range: true,
                comment: true
            });

            ast = escodegen.attachComments(ast, ast.comments, ast.tokens);

            escgOpts.sourceCode = source.toString();

            generated = escodegen.generate(ast, escgOpts);
        } catch (e) {
            throw new Error('cannot parse' + ' ' + file + ': (' + e.message + ')');
        }

        if (opts.fix) {
            try {
                fs.writeFileSync(file, generated, {flag: 'w'});
            } catch (e) {
                throw new Error('cannot write regenerated source code to' + ' ' + file + ': (' + e.message + ')');
            }
        } else {
            console.log(generated);
        }
    });
};
