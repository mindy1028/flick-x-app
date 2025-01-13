import { httpService } from '../utils/axios'
import { IDataWithError } from '../model/IDataWithError';

export const aliPayCreate = (user_id: number, subject_title: string, total_amount: string, platform_type: string, meal_id: number) => {
    return httpService.post<IDataWithError<{ token: string }>>('/payment/alipay/precreate', {
        user_id, subject_title, total_amount, platform_type, meal_id
    })
}

export const publicPayCreate = (user_id: number, amount: string) => {
    return httpService.post<IDataWithError<{ token: string }>>('/payment/public/precreate', {
        user_id, amount
    })
}