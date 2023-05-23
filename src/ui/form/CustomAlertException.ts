export class CustomAlertException{
    private readonly _message: string;
    constructor(message : string) {
        this._message = message;
    }

    public getMessage(){
        return this._message;
    }
}