// IDataWithError.ts
export interface IUserLoginDataWithError {
    data: {
        isSuccess: number;
        user_id: number
    };        // 存放实际的数据
    code: number;   // 存放响应的状态码
    msg: string;    // 存放响应的消息
}

export interface IFlickXGetAllDataWithError {
    data: {
        data: MiniProgram[]
    };        // 存放实际的数据
    code: number;   // 存放响应的状态码
    msg: string;    // 存放响应的消息
}

export interface IDataWithError<T> {
    data: T;        // 存放实际的数据
    code: number;   // 存放响应的状态码
    msg: string;    // 存放响应的消息
}