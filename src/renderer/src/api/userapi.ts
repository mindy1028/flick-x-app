import { httpService } from '../utils/axios'
import { IDataWithError, IUserLoginDataWithError } from '../model/IDataWithError';

export interface UserAuditInfo {
    user_account_type: number;
    account_audit_status: number;
    company_name: string;
    company_social_credit_code: string;
    company_industry: string;
    company_tax_number: string;
    company_bank_card_number: string;
    company_bank_branch: string;
    company_bank_branch_name: string;
    company_manager_name: string;
    company_manager_phone_number: string;
    user_person_id: string;
    user_person_id_type: string;
    user_job: string;
    user_phone_number: string;
}

//  获取所有开发文档信息
export const userGetCaptcha = (phonenumber: string) => {
    return httpService.post<IDataWithError<{ token: string }>>(
        '/user/getCaptcha',
        { phonenumber }
    );
}

// 用户登录
export const userLogin = (phonenumber: string, captcha: string) => {
    return httpService.post<IUserLoginDataWithError>(
        '/user/loginByCaptcha',
        { phonenumber, captcha }
    );
};


// 获取用户信息
export const getUserInfo = (user_id: number) => {
    return httpService.post<IDataWithError<{ token: string }>>(
        '/user/getAll',
        { user_id }
    );
};

// 开发者认证
export const userAudit = (user_id: number, audit_info: UserAuditInfo) => {
    return httpService.post<IDataWithError<{ token: string }>>(
        '/user/audit',
        { user_id, audit_info }
    );
};