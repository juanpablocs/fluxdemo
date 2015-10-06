var inquirer    = require('inquirer');
var path        = require('path');
var fs          = require('fs-extra');

var root                = path.resolve(".");
var path_neoflux        = root + "/.flux"; //folder
var path_neoflux_jade   = path_neoflux + "/pre_jade/"; //folder
var path_neoflux_stylus = path_neoflux + "/pre_stylus/"; //folder
var path_neoflux_schema = path_neoflux + "/schema.json";

var _schema = require(path_neoflux_schema);
var options = ['section', 'view'];

var validName = function(val){
    if(val.length < 2)
        return "error el nombre es muy corto"
    return true
};

module.exports = function(e){

    function getDirs (dir, files_){
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                files_.push(name);
                getDirs(name, files_);
            }
        }
        return files_;
    }

    function replaceFile(path, replace){
        fs.readFile(path, 'utf8', function(err, buffer){                       
            if(err) return console.error(err);
            var result = buffer.replace(replace[0], replace[1]);
            fs.writeFile(path, result, 'utf8', function (err) {
                if (err) return;
                console.log("great!!!");
            });

        });
    }

    if(options.indexOf(e) !== -1){
        var option = e;
        var questions = [{
            type: "input",
            name: "section_name",
            message: "Nombre de la sección",
            validate: validName
          },{
            type: "input",
            name: "view_name",
            message: "Nombre de la vista",
            default: function () { return "index"; },
            validate: validName
        }];

        inquirer.prompt( questions, function( answers ) {
            console.log( JSON.stringify(answers) );

            // path jade dest
            var path_jade_dest = path.resolve(_schema.paths.pre_html);
            

            // copiar
            fs.copy(path_neoflux_jade, path_jade_dest, function(e){
                
                var dirs = getDirs(path_jade_dest);
                
                dirs.forEach(function(dir){
                    
                    if(/\/section$/g.test(dir)){
                    
                        var old_section = dir;
                        var new_section = old_section.replace('section',answers.section_name);
                        
                        fs.rename(old_section, new_section, function(err){

                            if(err) return console.error(err);

                            if(dir.indexOf('_layouts') !== -1)
                            {
                                replaceFile(new_section+"/layout.jade", ['{{section}}', answers.section_name]);
                            }
                            else
                            {
                                var old_view = new_section+"/view.jade";
                                var new_view = old_view.replace('view.', answers.view_name+'.');
                                
                                fs.rename(old_view,  new_view, function(e){
                                
                                    console.log('correcto :)');
                                    replaceFile(new_view, ['{{section}}', answers.section_name])
                                });
                            }

                            // end rename view
                        });
                        // end rename section  
                    }
                });
                
            });
            // end copy


        });

    }
  
};