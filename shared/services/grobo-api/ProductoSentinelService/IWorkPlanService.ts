import { WorkPlan } from "../../../models/WorkPlan";
import { ApiBaseService } from "../ApiBaseService";

export interface IWorkPlanService extends ApiBaseService<WorkPlan> {
    updateWorkPlan(workplan: WorkPlan, params?): Promise<WorkPlan>
}