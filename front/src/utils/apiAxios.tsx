import { ApiConfiguration, IApiClient, RequestConfig } from '@/dto/IAPI';
import Axios, { AxiosInstance } from 'axios';

export default class ApiClient implements IApiClient {
  public client: AxiosInstance;
  private static instance: ApiClient;

  protected createAxiosClient(accessToken: string | null): AxiosInstance {
    if (accessToken) {
      return Axios.create({
        baseURL: '/api/',
        responseType: 'json' as const,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
          }),
        },
        timeout: 10 * 1000,
      });
    } else {
      return Axios.create({
        baseURL: '/api/',
        responseType: 'json' as const,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10 * 1000,
      });
    }
  }

  constructor() {
    const accessToken = localStorage.getItem('token');
    this.client = this.createAxiosClient(accessToken);
  }

  public static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
      console.log('new api client');
    }
    return ApiClient.instance.client;
  }

  /*async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: RequestConfig,
  ): Promise<TResponse> {
    try {
      const response = config
        ? await this.client.post<TResponse>(path, payload, config)
        : await this.client.post<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      //handleAxiosError(error);
    }
    return {} as TResponse;
  }

  async patch<TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse> {
    try {
      const response = await this.client.patch<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      //handleServiceError(error);
    }
    return {} as TResponse;
  }

  async put<TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(path, payload);
      return response.data;
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }

  async get<TResponse>(path: string, config?: RequestConfig): Promise<TResponse> {
    try {
      const response = await this.client.get<TResponse>(path, config);
    } catch (error) {
      // handleServiceError(error);
    }
    return {} as TResponse;
  }*/
}
