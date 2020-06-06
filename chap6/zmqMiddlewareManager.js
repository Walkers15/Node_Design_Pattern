module.exports = class ZmqMiddlewareManager{
    constructor(socket){
        this.socket = socket;
        this.inboundMiddleware = [];
        this.outboundMiddleware = [];
        socket.on('message', message => {
            //인바운드 메시지 처리
            this.executeMiddleware(this.inboundMiddleware,{
                data: message
            })
        })
    }
    send(data){
        const message = {
            data: data
        };
        //새로운 메시지가 소켓을 통해 전송될 때 미들웨어 실행
        //메시지가 아웃바운드 미들웨어 목럭의 필터들을 사용하여 처리됨.
       this.executeMiddleware(this.outboundMiddleware, message,
           () => {
           //미들웨어로 데이터 처리 후 소켓을 통해 전송
           this.socket.send(message.data);
           }) ;
    }
    use(middleware){
        //사용 미들웨어 등록
        //인바운드 미들웨어는 목록의 끝으로 푸쉬
        //아웃바운드 미들웨어는 목록의 시작 부분에 삽입됨
        //상호 보완적인 인/아웃바운드 미들웨어 함수는 일반적으로 역순으로 실행되어야 하기 때문
        //ex)JSON을 사용하여 인바운드 메시지의 압출을 풀고 역직렬화하는 경우
        //이것에 사응하는 아웃바운드는 먼저 직렬화한 다음 압축해야 한다.
        if(middleware.inbound){
            this.inboundMiddleware.push(middleware.inbound);
        }
        if(middleware.outbound){
            this.outboundMiddleware.unshift(middleware.outbound);
        }
    }

    executeMiddleware(middleware, arg, finish){
        //미들웨어 기능을 비동기 순차 실행
        function iterator(index){
            if(index === middleware.length){
                return finish && finish();
            }
            middleware[index].call(this,arg,err=>{
                if(err){
                    return console.log('There was an error: ',err.message);
                }
                iterator.call(this,++index);
            });
        }
        iterator.call(this,0);
    }
};