function createLoggingWritable(writableOrig){
    const proto = Object.getPrototypeOf(writableOrig);

    function LoggingWritable(writableOrig){
        this.writableOrig = writableOrig;
    }

    LoggingWritable.prototype = Object.create(proto);
    //write 메소드를 가로채서 프록시
    LoggingWritable.prototype.write = function(chunk,enc,callback){
        if(!callback && typeof enc === 'function'){
            callback = enc;
            enc = undefined;
        }
        console.log('Writing ', chunk);
        return this.writableOrig.write(chunk, enc, function(){
            console.log('Finished writing ', chunk);
            callback && callback();
        });
    };

    //다른 메소드들은 델리게이트(위임)함
    LoggingWritable.prototype.on = function(){
        return this.writableOrig.on.apply(this.writableOrig,arguments);
    };

    LoggingWritable.prototype.end = function(){
            return this.writableOrig.end.apply(this.writableOrig, arguments);
    };

    return new LoggingWritable(writableOrig);
}

const fs = require('fs');

const writable = fs.createWriteStream('test.txt');
const writableProxy = createLoggingWritable(writable);

writableProxy.write('First chunk\n');
writableProxy.write('Second chunk\n');
writable.write('This is not logged');
writableProxy.end();