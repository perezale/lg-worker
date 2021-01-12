import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export abstract class ApiBaseService<T> {

  protected endpoint: string;

  constructor() {
    
  }

  public async get(id: Number, params?): Promise<T> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<T> = await axios.get<T>(this.endpoint + '/' + id, options);
    return response.data as T;
  }

  public async getAll(params?): Promise<T[]> {

    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<T[]> = await axios.get<T[]>(this.endpoint + '/', options);
    return response.data as T[];
  }

  public async store(item: any, params?): Promise<T> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<T> = await axios.post<T>(this.endpoint + '/', item, options);
    return response.data as T;
  }

  public async update(id: any, item: any, params?): Promise<T> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<T> = await axios.put<T>(this.endpoint + '/' + id, item, options);
    return response.data as T;
  }

  public async remove(id: any, params?): Promise<any> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<T> = await axios.delete<T>(this.endpoint + '/' + id, options);
    return response.data;
  }

}

export function Endpoint(value) {
  return function decorator(target) {
    target.prototype.endpoint = value;
  };
}
