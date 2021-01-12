import { ProductoSentinel } from "../../../models/ProductoSentinel";
import { StateEnum } from "../../../models/StateEnum";
import { ProductoSentinelReadyDTO } from "../../dtos/ProductoSentinelReadyDTO";
import { ApiBaseService } from "../ApiBaseService";

export interface IProductoSentinelService extends ApiBaseService<ProductoSentinel> {
  getAllReady(params?): Promise<ProductoSentinelReadyDTO>
  updateStatus(id:any, status: StateEnum, params?): Promise<Boolean>
}