import { BlobStorageClientService } from "./shared/services/BlobStorageClientService";
import { ProductoSentinelReadyDTO } from "./shared/services/dtos/ProductoSentinelReadyDTO";
import { FastDiskClientService } from "./shared/services/FastDiskClientService";
import { ProcessorClientService } from "./shared/services/ProcessorClientService";

import * as fs from 'fs';
import * as yargs from 'yargs'
import { parse } from "path";
import { runInContext } from "vm";
import ProcessManager from "./shared/services/ProcessManager";
import { ProductoSentinelService } from "./shared/services/grobo-api/ProductoSentinelService/ProductoSentinelService";

import * as dotenv from'dotenv';
import axios from 'axios';
import { WorkPlan, WorkPlanStateEnum } from "./shared/models/WorkPlan";

dotenv.config( { path: __dirname + '/../.env'} );
axios.defaults.baseURL = process.env.GROBO_API + '/';

//const GROBO_API = process.env.GROBO_API ?? 'http://192.168.7.85:8080/api/';

async function work() {
    
  let productosSentinelReady: ProductoSentinelReadyDTO = await this.productoSentinelService.getAllReady();
  let dataFolder = 'workplan_' + productosSentinelReady.workPlan.pasadaId + '_' + productosSentinelReady.workPlan.esquemaTileId;

  console.log(productosSentinelReady);

  let newFiles = []
  let storageClient = new BlobStorageClientService();
  for (const producto of productosSentinelReady.productosSentinel) {
      console.log('Producto Sentinel Disponible: ' + JSON.stringify(producto));

      let file = await storageClient.downloadProduct(producto.uuid, dataFolder);
      console.log('Producto Sentinel descargado: ' + file);
  }

  if (newFiles.length > 0) {
      await (new FastDiskClientService).saveFile(dataFolder + '/workplan.json', JSON.stringify(productosSentinelReady));
    
      //Llama al run del procesador
      let processorClient = new ProcessorClientService();
      let processorResponse = await processorClient.run(productosSentinelReady);
      console.log(processorResponse);

  }

console.log(newFiles);
}


//Parse input file

function parseInputFile(filename){
    let fileContent = fs.readFileSync(filename as string,'utf8');
    let data = fileContent.split(/\r?\n/);
    var lines = [];
    for(var i = 1; i < data.length; i++){
        lines.push(data[i].split(/\s\s+/g));
    }
    let entries = lines.map((line) => {
        let fechaFin = new Date(line[2]);
        fechaFin.setDate(fechaFin.getDate() + 1) //Increment in 1 to include date
        return {
            "pasada": line[0],
            "fechaInicio": new Date(line[1]),
            "fechaFin": new Date(line[2]),
            "esquema": line[3],
            "habilitado": line[4],
            "nombre": line[5]
        }
    });
    return entries;
}

//Download products
async function downloadProducts(entries) {
    let storageClient = new BlobStorageClientService();

    let products = [];

    for(const entry of entries){
        console.log(entry.fechaInicio)
        if(!entry.habilitado) continue;
        
        let sentinelProducts = await new ProductoSentinelService().getAll({
            'dateBefore': entry.fechaInicio.getFullYear() + "-" + entry.fechaInicio.getMonth()+1 + '-' + entry.fechaInicio.getDate(),
            'dateAfter': entry.fechaFin.getFullYear() + "-" + entry.fechaFin.getMonth()+1 + '-' + entry.fechaFin.getDate(),
        })


        sentinelProducts.forEach(function(product) {
            let index = products.findIndex(function(item){
                return item.uuid === product.uuid;
            })
            if(index === -1){
                products.push(product);
            }
        });
        

    }

    for(const product of products) {
        let file = await storageClient.downloadProduct(product.uuid, process.env.FAST_DISK_MOUNT_DIR);
        console.log('Downloaded file: ' + file);
    }
    
    let workPlan : WorkPlan = {
        esquemaTileId: 0,
        pasadaId: 0,
        estado: WorkPlanStateEnum.copied
    }
    
    let sentinelReady : ProductoSentinelReadyDTO = {
        esquemaTileGeojson: {},
        workPlan: workPlan,
        productosSentinel: products
    }

    return sentinelReady;
}

async function run() {
    let pm = new ProcessManager();

    let input = new Object as ProductoSentinelReadyDTO;
    
    const sharedDiskPath = process.env.FAST_DISK_MOUNT_DIR || '/app/data/'

    let dataFolder = 'workplan_' + input.workPlan.pasadaId + '_' + input.workPlan.esquemaTileId;
    let workPlanFilePath = `${sharedDiskPath}/${dataFolder}/workplan.json`;
    let outputPath = `${sharedDiskPath}/output/${dataFolder}`;
    fs.writeFileSync(workPlanFilePath, JSON.stringify(input));
    
    //pm.run(input);
}

async function main(){
    let args = yargs
    .option('input', {
        alias: 'i',
        demand: true
    }).argv;
    let entries = parseInputFile(args.input);
    
    await downloadProducts(entries);
    //await run();
}

main();
//work();
