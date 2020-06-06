module.exports.json = () => {
    return{
        inbound: function(message, next){
            //입력으로 받은 메시지를 역직렬화하고, 메시지의 데이터 속성에
            //결과를 다시 할당하여 파이프라인의 추가적 처리를 할 수 있게 함
            message.data = JSON.parse(message.data.toString());
            next();
        },
        outbound: function(message, next){
            //모든 데이터를 message.data에 직렬화
            message.data = new Buffer(JSON.stringify(message.data));
            next();
        }
    }
};