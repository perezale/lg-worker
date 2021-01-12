
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { WorkPlan } from '../../models/WorkPlan';
import { ApiBaseService, Endpoint } from './ApiBaseService';

@Endpoint('plan')
export class WorkPlanService extends ApiBaseService<WorkPlan> {

  public async getWorkPlansByEsquemaTile(esquemaTileId: number, params?): Promise<WorkPlan[]> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<WorkPlan[]> = await axios.get<WorkPlan[]>(this.endpoint + '/esquema/' + esquemaTileId, options);
    return response.data as WorkPlan[];
  }

  public async getWorkPlansByPasada(pasadaId: number, params?): Promise<WorkPlan[]> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<WorkPlan[]> = await axios.get<WorkPlan[]>(this.endpoint + '/pasada/' + pasadaId, options);
    return response.data as WorkPlan[];
  }

  public async getWorkPlanByPasadaAndEsquemaTile(pasadaId: number, esquemaTileId: number, params?): Promise<WorkPlan> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<WorkPlan> = await axios.get<WorkPlan>(this.endpoint + '/pasada/' + pasadaId + '/esquema/' + esquemaTileId, options);
    return response.data as WorkPlan;
  }

  public async updateWorkPlan(workplan: WorkPlan, params?): Promise<WorkPlan> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<WorkPlan> = await axios.put<WorkPlan>(this.endpoint + '/pasada/' + workplan.pasadaId + '/esquema/' + workplan.esquemaTileId, workplan, options);
    return response.data as WorkPlan;
  }

  public async deleteWorkPlan(workplan: WorkPlan, params?): Promise<any> {
    let options: AxiosRequestConfig = { params: params };
    let response: AxiosResponse<any> = await axios.delete<any>(this.endpoint + '/pasada/' + workplan.pasadaId + '/esquema/' + workplan.esquemaTileId, options);
    return response.data;
  }
  
}