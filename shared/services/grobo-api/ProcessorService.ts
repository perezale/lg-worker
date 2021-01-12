
import { ApiBaseService, Endpoint } from './ApiBaseService';
import axios, { AxiosResponse, } from 'axios';
import { ProductoSentinelReadyDTO } from '../dtos/ProductoSentinelReadyDTO';

@Endpoint('processor')
export class ProcessorService{

    private axios;

    public constructor() {
        this.axios = axios.create({
            baseURL: process.env.GROBO_PROCESADOR || 'http://localhost:3000'
          });
    }

    public async postProcessor(productosSentinelReady: ProductoSentinelReadyDTO): Promise<String> {
        let response: AxiosResponse<String> = await this.axios.post('/run', productosSentinelReady);
        return response.data as String;
    }

    public async getProcessor(): Promise<String> {
        let response: AxiosResponse<String> = await this.axios.get('/status');
        return response.data as String;
    }

}