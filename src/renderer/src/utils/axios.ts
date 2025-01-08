import axiosRetry from 'axios-retry';
import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IDataWithError } from '../model/IDataWithError';

class HttpService {
    private http!: AxiosInstance;

    constructor() {
        this.http = axios.create({
            baseURL: "http://192.168.1.4:8082",
            timeout: 60000,
        });

        axiosRetry(this.http, {
            retries: 3,
            shouldResetTimeout: true,
            // 重复请求延迟
            retryDelay: (retryCount: number) => {
                return retryCount * 1000;
            },
            retryCondition: (error: AxiosError) => {
                if (error.message.includes('timeout')) {
                    return true;
                }

                return !error.response || error.response.status !== 401;
            },
        });

        this.addInterceptors(this.http);
    }

    get<T>(url: string, config?: AxiosRequestConfig) {
        return this.handleErrorWrapper<T>(this.http.get(url, config));
    }

    post<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
        return this.handleErrorWrapper<T>(this.http.post(url, param, config));
    }

    postDownload<T>(url: string, param: unknown) {
        return this.handleErrorWrapper<T>(this.http.post(url, param, { responseType: 'arraybuffer' }));
    }

    put<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
        return this.handleErrorWrapper<T>(this.http.put(url, param, config));
    }

    delete<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
        return this.handleErrorWrapper<T>(this.http.delete(url, { data: param, ...config }));
    }

    private addInterceptors(http: AxiosInstance) {
        // 一、请求拦截器
        http.interceptors.request.use((config) => {
            // 1、添加token和项目id
            // const token = CookieManager.getCookie('userToken');
            const token = "usertoken";
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            // 2、验证请求状态码
            config.validateStatus = (status) => {
                switch (status) {
                    case 401:
                        // const instance = Message.error('用户信息过期，请重新登录');
                        setTimeout(() => {
                            // instance.close();
                            // router.push('/login');
                        }, 1000);
                        break;
                    default:
                        // console.warn(`status= ${status}`);
                        break;
                }
                return status >= 200 && status < 400;
            };

            return config;
        });

        // 二、响应拦截器
        http.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                return Promise.reject(error);
            },
        );
    }

    private async handleErrorWrapper<T>(p: AxiosPromise): Promise<IDataWithError<T>> {
        return p
            .then((response) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                return {
                    // ...error.response?.data,
                    ...error
                };
            });
    }
}

export const httpService = new HttpService();