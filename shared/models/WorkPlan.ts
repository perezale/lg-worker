export interface WorkPlan {
  pasadaId: Number,
  esquemaTileId: Number,
  estado?: string
}

export enum WorkPlanStateEnum {
  pending = "PENDIENTE",
  copying = "COPIANDO",
  copied = "COPIADO",
  processing = "PROCESANDO",
  processed = "PROCESADO",
  finalized = "FINALIZADO",
  error = "ERROR",
  
}
