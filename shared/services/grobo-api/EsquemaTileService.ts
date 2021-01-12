
import { ApiBaseService, Endpoint } from './ApiBaseService';

@Endpoint('esquema')
export class EsquemaTileService extends ApiBaseService<EsquemaTile> {

  public async getAll(params?): Promise<EsquemaTile[]> {
    throw new Error("not Implemented")
  }
  
}