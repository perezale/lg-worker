import { WorkPlan } from "./WorkPlan";

export enum ProductoSentinelStateEnum {
  pending = "PENDIENTE",
  downloaded = "DESCARGADO",
  copying = "COPIANDO",
  copied = "COPIADO",
  processed = "PROCESADO",
  error = "ERROR",
  
}

export interface ProductoSentinel {
  "directorio"?: string,
  "id": Number,
  "fecha": string,
  "estado": ProductoSentinelStateEnum,
  "geojson"?: {
    "type": string,
    "geometry": {
      "type": string
    },
    "id": Object,
    "properties": Object
  },
  "porcentajeNubes": Number,
  "uuid": string
}

export interface ProductoSentinelReadyDTO {
  "workPlan": WorkPlan,
  "esquemaTileGeojson": Object,
  "productosSentinel": Array<ProductoSentinel>
}