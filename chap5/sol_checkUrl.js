"use strict";
const stream = require('stream');
const fs = require('fs');
const split = require('split');
const request = require('request');
const ParallelStream = require('./parallelStream');
class ToConsole extends stream.Writable{
    _write(chunk, enc, cb){
        console.log(chunk.toString());
    }
}
const write = new ToConsole();
fs.createReadStream(process.argv[2])         //[1]
    .pipe(split())                             //[2]
    .pipe(new ParallelStream((url, enc, done, push) => {     //[3]
        if(!url) return done();
        request.head(url, (err, response) => {
            push(url + ' is ' + (err ? 'down' : 'up') + '\n');
            done();
        });
    }))
    .pipe(fs.createWriteStream('results.txt'))   //[4]
    //.pipe(process.stdout)
    .on('finish', () => process.stdout.write('All urls were checked'))
;