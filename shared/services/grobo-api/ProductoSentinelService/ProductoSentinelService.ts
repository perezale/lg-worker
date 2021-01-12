
import { ApiBaseService, Endpoint } from '../ApiBaseService';
import { ProductoSentinel } from '../../../models/ProductoSentinel';
import { StateEnum } from '../../../models/StateEnum';
import { ProductoSentinelReadyDTO } from '../../dtos/ProductoSentinelReadyDTO';
import { IProductoSentinelService } from "./IProductoSentinelService";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Endpoint('productos')
export class ProductoSentinelService extends ApiBaseService<ProductoSentinel> implements IProductoSentinelService {

  public async getAllReady(params?): Promise<ProductoSentinelReadyDTO> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<ProductoSentinelReadyDTO> = await axios.get<ProductoSentinelReadyDTO>(this.endpoint + '/ready', options);
    return response.data as ProductoSentinelReadyDTO;
  }

  public async updateStatus(id: any, status: StateEnum, params?) : Promise<Boolean> {
    let options: AxiosRequestConfig = { params: params };
    try{
      let response: AxiosResponse<ProductoSentinelReadyDTO> = await axios.put<ProductoSentinelReadyDTO>(this.endpoint + "/" + id + '/estado/' + status, options);
      let data = response.data as any;
      return data.estado == status;
    }
    catch (err) {
      console.log('Error updating status for product ' + id);
    }
    return false;
  }

}