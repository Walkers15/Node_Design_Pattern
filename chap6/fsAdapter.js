const path = require('path');

module.exports = function createFsAdapter(db){
    const fs = {};
    //fs 모듈의 원래 함수와 호환되는 readFile() 함수 구현
    fs.readFile = (filename, options, callback) => {
        if(typeof options === callback){
            callback = options;
            options = {};
        }else if(typeof options === 'string'){
            options = {encoding: options};
        }

        db.get(path.resolve(filename),{//파일명을 키로 사용하여 db.get 호출
            valueEncoding: options.encoding
        },
            (err, value) => {//콜백 함수
            if(err){//파일을 찾지 못한 경우 에러 설정
                if(err.type === 'NotFoundError'){
                    err = new Error(`ENOENT, open "${filename}"`);
                    err.conde = 'ENOENT';
                    err.errno = 34;
                    err.path = filename;
                }
                return callback && callback(err);
            }
            callback && callback(null, value);//찾은 경우 값 전달(에러가 없으므로 콜백이 null)
            });
    };
    fs.writeFile = (filename, contents, options, callback)=>{
        if(typeof options === 'function'){
            callback = options;
            options = {};
        }else if(typeof options === 'string'){
            options = {encoding: options};
        }

        db.put(path.resolve(filename), contents, {
            valueEncoding: options.encoding
        },callback);
    };
    return fs;
};