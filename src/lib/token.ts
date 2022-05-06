class StorageToken{
    key : string;
    constructor(key : string){
        this.key = key;
    }
    get(){
        return localStorage.getItem(this.key);
    }
    remove(){
        localStorage.removeItem(this.key);
        return this;
    }
    set(token : string){
        localStorage.setItem(this.key,token);
        return this;
    }
    static factory(key : string){
        return new StorageToken(key);
    }
}
export const Token = StorageToken.factory(`__${process.env.APP_NAME}_APP_TOKEN__`);
