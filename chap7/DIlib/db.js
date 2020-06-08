const level = require('level');
const sublevel = require('level-sublevel');

//DB모듈을 팩토리로 변경하여 원하는 만큼의 DB 인스턴스를 생성할 수 있게 함
module.exports = dbName => {
    return sublevel(
        level(dbName, {valueEncoding: 'json'})
    );
};