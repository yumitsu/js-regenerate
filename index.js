var esprima   = require('esprima'),
    escodegen = require('escodegen'),
    fs        = require('fs'),
    path      = require('path'),
    source    = void(0),
    ast       = void(0),
    generated = void(0),
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
        console.error('jsregenerate: ' + e.toString());
        process.exit(1);
    }

    console.log(generated);
}
