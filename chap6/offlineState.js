const jot = require('json-over-tcp');

module.exports = class OfflineState{

    constructor(failsafeSocket) {
        this.failsafeSocket = failsafeSocket;
    }

    send(data){//오프라인에서는 큐에 데이터를 집어넣음
       this.failsafeSocket.queue.push(data);
    }

    activate(){
        //json-over-tcp를 사용하여 서버와의 연결 설정 시도, 실패하면 500밀리초 후에 다시 시도
        //성공하면 failsafeSocket의 상태를 온라인으로 전환
        const retry = ()=>{
            setTimeout(() => this.activate(), 500);
        }

        this.failsafeSocket.socket = jot.connect(
            this.failsafeSocket.options,
            () => {
                this.failsafeSocket.socket.removeListener("error", retry);
                this.failsafeSocket.changeState('online');
            }
        );
        this.failsafeSocket.socket.once('error',retry);

    }
}