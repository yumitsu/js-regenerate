var nom = require('nomnom'), pkg = require('../package.json'), options = {
        fix: {
            abbr: 'f',
            flag: true,
            help: 'Parse file and replace its original source with regenerated one'
        },
        help: {
            abbr: 'h',
            flag: true,
            help: 'Show usage info and exit'
        },
        file: {
            position: 0,
            help: 'File(s) to regenerate',
            list: true,
            required: true
        },
        version: {
            abbr: 'v',
            flag: true,
            help: 'Show version and exit',
            callback: function () {
                return pkg.name + ' ' + pkg.version;
            }
        }
    }, parser;

parser = nom.script(pkg.name).options(options);

exports.parse = function () {
    return parser.parse();
};

exports.usage = function () {
    return console.info(parser.getUsage());
};
