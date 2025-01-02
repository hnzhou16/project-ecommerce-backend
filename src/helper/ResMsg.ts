export class ResMsg {
    statusCode: number
    msg: string
    data: any

    constructor(statusCode: number=null, msg: string=null, data=null) {
        this.statusCode = statusCode
        this.msg = msg
        this.data = data
    }
}