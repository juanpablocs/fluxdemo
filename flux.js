var commander   = require('commander');
var fs          = require('fs-extra');

var program_create = require('./programs/create');
var program = require('./program');


var cli = new program(commander);

// INIT
cli.run('create', program_create);