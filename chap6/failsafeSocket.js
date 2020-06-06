const OfflineState = require('./offlineState');
const OnlineState = require('./onlineState');

class FailsafeSocket{
    constructor(options) {//데이터 구조 초기화 및 두 가지 states 정의
        this.options = options;
        this.queue = [];
        this.currentState = null;
        this.socket = null;
        this.states = {
            offline: new OfflineState(this),
            online: new OnlineState(this)
        };
        this.changeState('offline');
    }
    changeState(state){//한 상태에서 다른 상태로 전환
        console.log('Activating state: ',state);
        this.currentState = this.states[state];
        this.currentState.activate();
    }
    send(data){//소켓의 기능, 온/오프라인에 따라 다르게 기능해야 하며, 현재 활성 상태를 작업에 위임하여 수행함
        this.currentState.send(data);
    }
}

module.exports = options => {
    return new FailsafeSocket(options);
};