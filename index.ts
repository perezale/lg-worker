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

        let dateBefore = entry.fechaInicio.getFullYear() + "-" + entry.fechaInicio.getMonth()+1 + '-' + entry.fechaInicio.getDate();
        let dateAfter = entry.fechaFin.getFullYear() + "-" + entry.fechaFin.getMonth()+1 + '-' + entry.fechaFin.getDate();
        console.log(`Querying products for ${dateBefore} - ${dateAfter}` )
        
        let sentinelProducts = [];
        try {
            sentinelProducts = await new ProductoSentinelService().getAll({
                'dateBefore': dateBefore,
                'dateAfter': dateAfter,
            })
        }
        catch(ex) {
            console.log('EXCEPTION:' + ex)
        }
        
        sentinelProducts.forEach(function(product) {
            let index = products.findIndex(function(item){
                return item.uuid === product.uuid;
            })
            if(index === -1){
                console.log("adding product " + product.uuid)
                products.push(product);
            }
            else {
                console.log("skipping product " + product.uuid)
            }
        });
        

    }

   console.log("Total products:" + products.length);
    console.log(products);

    
    for(const product of products) {
        let file = await storageClient.downloadProduct(product.uuid, 'products');
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

async function run(input) {
    let pm = new ProcessManager();
    
    const sharedDiskPath = process.env.FAST_DISK_MOUNT_DIR || '/app/data/'

    let dataFolder = 'workplan_' + input.workPlan.pasadaId + '_' + input.workPlan.esquemaTileId;

    fs.mkdirSync(`${sharedDiskPath}/${dataFolder}/`, { "recursive": true });
    
    let workPlanFilePath = `${sharedDiskPath}/${dataFolder}/workplan.json`;
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
    
    let sentinelReady = await downloadProducts(entries);
    await run(sentinelReady);
}

main();
