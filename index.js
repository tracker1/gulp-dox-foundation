'use strict';

var es = require('event-stream'),
    dox = require('dox'),
    formatter = require('dox-foundation')
    ;

module.exports = function CreateDoxFoundationMapper(options) {
  return es.map(function MapJavaScriptToDoxFoundation(data, cb){
    try {
      // process based on dox-foundation/bin/dox-foundation
      var infile, 
          output,
          input = data.contents
          ;

      if (!input) return cb(null, data); //nothing to see here
      if (typeof input !== "string") input = input.toString(); //make it a string

      // Run the buffer through Dox
      infile = { dox: dox.parseComments(input, { raw: options.raw }) }

      // Run the json to be formatted and dumped to stdout
      var output = formatter.render(infile, null, { title: options && options.title || 'Documentation' });
      data.contents = new Buffer(output, 'utf8');
      console.log(data.path);
      data.path = data.path.replace(/\.[^\.]+$/, '') + '.html';
      console.log(data.path);
      cb(null, data);
  
    } catch(err) {
      cb(err);
    }
  });
};
