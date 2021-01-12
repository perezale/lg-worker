import { ProductoSentinel } from "../../models/ProductoSentinel";
import { WorkPlan } from "../../models/WorkPlan";

export interface ProductoSentinelReadyDTO {
  "workPlan": WorkPlan,
  "esquemaTileGeojson": Object,
  "productosSentinel": Array<ProductoSentinel>
}