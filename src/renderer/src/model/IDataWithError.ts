export interface IDataWithError<T> {
    data: T;        // 存放实际的数据
    code: number;   // 存放响应的状态码
    msg: string;    // 存放响应的消息
}

export interface IUserLoginDataWithError extends IDataWithError<{
}> {
    isSuccess: number;
    user_id: number;
    error_msg: string;
}

export interface IFlickXGetAllDataWithError extends IDataWithError<{
}> {
    data: MiniProgram[];
}