// IUserDataModel.ts
export interface IUserDataModel {
    user_id: number; // 用户ID
    group_id: number; // 用户组ID
    user_name: string; // 用户名
    user_account: string; // 用户账号
    user_email: string; // 用户邮箱
    user_phone_number: string; // 用户电话号码
    company_name: string; // 公司名称
    develop_password: string; // 用户密码
    create_time: string; // 创建时间
    api_platform_last_login_datetime: string; // API平台最后登录时间
    cineai_platform_last_login_datetime: string; // CineAI平台最后登录时间
    user_country: string; // 用户国家
    user_account_type: number; // 用户账号类型
    company_tax_number: string; // 公司税号
    company_bank_card_number: string; // 公司银行卡号
    company_bank_branch_name: string; // 公司银行分支名称
    account_audit_status: number; // 账号审核状态
    user_area: string; // 用户地区
    user_meal_id: number; // 用户套餐ID
    user_deposit_count: number; // 用户存款次数
    user_deposit_amount: number; // 用户存款金额
    user_remain_energy: number; // 用户剩余能量
    user_img_product_count: number; // 用户图片产品数量
    user_vid_product_count: number; // 用户视频产品数量
    user_login_duration: string; // 用户登录持续时间
    user_is_logout: number; // 用户是否已登出
    user_logout_datetime: string; // 用户登出时间
    user_wx_avatar_url: string; // 用户微信头像URL
    user_wx_name: string; // 用户微信昵称
    user_wx_access_token: string; // 用户微信访问令牌
    platform_current_balance_sum: number; // 平台当前余额总额
    platform_current_balance_cash: number; // 平台当前现金余额
    platform_current_balance_voucher: number; // 平台当前代金券余额
    platform_current_balance_arrears: number; // 平台当前欠款余额
    platform_current_balance_credit: number; // 平台当前信用余额
    platform_current_balance_invoice: number; // 平台当前发票余额
    user_token: string; // 用户令牌
    user_platform_token: string; // 用户平台令牌
    remark1: string; // 备注1
    remark2: string; // 备注2
    remark3: string; // 备注3
}

// UserDataModel.ts
export class UserDataModel implements IUserDataModel {
    public user_id: number; // 用户ID
    public group_id: number; // 用户组ID
    public user_name: string; // 用户名
    public user_account: string; // 用户账号
    public user_email: string; // 用户邮箱
    public user_phone_number: string; // 用户电话号码
    public develop_password: string; // 用户密码
    public create_time: string; // 创建时间
    public api_platform_last_login_datetime: string; // API平台最后登录时间
    public cineai_platform_last_login_datetime: string; // CineAI平台最后登录时间
    public user_country: string; // 用户国家
    public user_account_type: number; // 用户账号类型
    public company_name: string; // 公司名称
    public company_tax_number: string; // 公司税号
    public company_bank_card_number: string; // 公司银行卡号
    public company_bank_branch_name: string; // 公司银行分支名称
    public account_audit_status: number; // 账号审核状态
    public user_area: string; // 用户地区
    public user_meal_id: number; // 用户套餐ID
    public user_deposit_count: number; // 用户存款次数
    public user_deposit_amount: number; // 用户存款金额
    public user_remain_energy: number; // 用户剩余能量
    public user_img_product_count: number; // 用户图片产品数量
    public user_vid_product_count: number; // 用户视频产品数量
    public user_login_duration: string; // 用户登录持续时间
    public user_is_logout: number; // 用户是否已登出
    public user_logout_datetime: string; // 用户登出时间
    public user_wx_avatar_url: string; // 用户微信头像URL
    public user_wx_name: string; // 用户微信昵称
    public user_wx_access_token: string; // 用户微信访问令牌
    public platform_current_balance_sum: number; // 平台当前余额总额
    public platform_current_balance_cash: number; // 平台当前现金余额
    public platform_current_balance_voucher: number; // 平台当前代金券余额
    public platform_current_balance_arrears: number; // 平台当前欠款余额
    public platform_current_balance_credit: number; // 平台当前信用余额
    public platform_current_balance_invoice: number; // 平台当前发票余额
    public user_token: string; // 用户令牌
    public user_platform_token: string; // 用户平台令牌
    public remark1: string; // 备注1
    public remark2: string; // 备注2
    public remark3: string; // 备注3

    constructor(data: IUserDataModel) {
        this.user_id = data.user_id;
        this.group_id = data.group_id;
        this.user_name = data.user_name;
        this.user_account = data.user_account;
        this.user_email = data.user_email;
        this.company_name = data.company_name;
        this.user_phone_number = data.user_phone_number;
        this.develop_password = data.develop_password;
        this.create_time = data.create_time;
        this.api_platform_last_login_datetime = data.api_platform_last_login_datetime;
        this.cineai_platform_last_login_datetime = data.cineai_platform_last_login_datetime;
        this.user_country = data.user_country;
        this.user_account_type = data.user_account_type;
        this.company_tax_number = data.company_tax_number;
        this.company_bank_card_number = data.company_bank_card_number;
        this.company_bank_branch_name = data.company_bank_branch_name;
        this.account_audit_status = data.account_audit_status;
        this.user_area = data.user_area;
        this.user_meal_id = data.user_meal_id;
        this.user_deposit_count = data.user_deposit_count;
        this.user_deposit_amount = data.user_deposit_amount;
        this.user_remain_energy = data.user_remain_energy;
        this.user_img_product_count = data.user_img_product_count;
        this.user_vid_product_count = data.user_vid_product_count;
        this.user_login_duration = data.user_login_duration;
        this.user_is_logout = data.user_is_logout;
        this.user_logout_datetime = data.user_logout_datetime;
        this.user_wx_avatar_url = data.user_wx_avatar_url;
        this.user_wx_name = data.user_wx_name;
        this.user_wx_access_token = data.user_wx_access_token;
        this.platform_current_balance_sum = data.platform_current_balance_sum;
        this.platform_current_balance_cash = data.platform_current_balance_cash;
        this.platform_current_balance_voucher = data.platform_current_balance_voucher;
        this.platform_current_balance_arrears = data.platform_current_balance_arrears;
        this.platform_current_balance_credit = data.platform_current_balance_credit;
        this.platform_current_balance_invoice = data.platform_current_balance_invoice;
        this.user_token = data.user_token;
        this.user_platform_token = data.user_platform_token;
        this.remark1 = data.remark1;
        this.remark2 = data.remark2;
        this.remark3 = data.remark3;
    }

    /**
     * 将 UserDataModel 实例转换为 JSON 字符串
     */
    public toString(): string {
        return JSON.stringify(this);
    }

    /**
    * 使用 JSON 字符串构造 UserDataModel 实例
    * @param jsonStr JSON 字符串
    */
    public static fromJson(jsonStr: string): UserDataModel {
        const data = JSON.parse(jsonStr);
        return new UserDataModel(data);
    }
}