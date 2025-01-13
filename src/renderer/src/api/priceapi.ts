import { httpService } from '../utils/axios'
import { PriceDataModel } from '../model/IPriceDataModel';
import { IDataWithError, IPriceGetAllDataWithError } from '../model/IDataWithError';

export const priceGetCine = () => {
    return httpService.post<IDataWithError<{ record_total: number, record_list: PriceDataModel[] }>>('/price/getCine', {})
}