import { httpService } from '../utils/axios'
import { IDataWithError } from '../model/IDataWithError';

//  获取智能体列表
export const agentSelectAll = () => {
    return httpService.get<IDataWithError<MiniProgram[]>>(
        '/flickx/selectall'
    );
}