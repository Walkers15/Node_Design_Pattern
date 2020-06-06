module.exports = function levelSubscribe(db){
    //객체 증강을 통한 Decorate
    db.subscribe = (pattern, listener) => {
        db.on('put', (key, val)=>{
            const match = Object.keys(pattern).every(
                k => (pattern[k] === val[k])
            );
            if(match) {
                listener(key, val);
            }
        });
    };

    return db;
}