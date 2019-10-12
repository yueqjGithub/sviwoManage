export default class BaseObject{
    constructor(){

    }

    static New(obj){
        let self = new this;
        for(let k in obj){
            if(self.hasOwnProperty(k)){
                self[k] = obj[k];
            }
        }
        return self;
    }

}