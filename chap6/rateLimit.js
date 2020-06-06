const lastCall = new Map();

module.exports = function*(next){
    //인바운드
    const now = new Date();
    //요청 시간이 1초 이하(1초 안에 두 개 이상의 요청이 올 경우
    if(lastCall.has(this.ip) && now.getTime() - lastCall.get(this.ip).getTime() < 1000){
        return this.status = 429;//Too Many Requests
    }
    yield next;
    lastCall.set(this.ip,now);
    //this.set('X-RateLimit-Reset', now.getTime() + 1000);
};