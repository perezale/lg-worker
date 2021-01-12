import * as fs from 'fs'
import * as path from 'path'

import { AbortController } from '@azure/abort-controller';
import { BlobServiceClient } from '@azure/storage-blob';

export class BlobStorageClientService {

  private blobServiceClient : BlobServiceClient ;

  private productContainer = process.env.BLOB_CONTAINER_NAME || 'products';
  private outputDir;

  private outputBlobContainer = process.env.TILE_CONTAINER_NAME || 'tiles';

  public constructor(){ 
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(conn);

    this.outputDir = process.env.FAST_DISK_MOUNT_DIR || '/app/data/'
    if (! (this.outputDir.substr(-1) === '/')) {
      this.outputDir += '/';
    }
  }

  public async downloadProduct(uuid: string, directory: string) {

    let productFiles = await this.getProductFilesByUUID(uuid);

    for(let blobItem of productFiles){
      
      await this.downloadBlob(blobItem.name, directory);
    }
    
    return uuid;
  }

  private async getProductFilesByUUID(uuid: string){
    const containerClient = this.blobServiceClient.getContainerClient(this.productContainer);
    let products = [];
    for await (const blob of containerClient.listBlobsFlat({prefix: uuid})) {
      if(blob)
        products.push(blob);
    }
    return products;
  }

  public async downloadBlob(filename: string, directory:string ) {
    const containerClient = this.blobServiceClient.getContainerClient(this.productContainer);
    
    const blockBlobClient = await containerClient.getBlockBlobClient(filename);
    try{
      let folder = `${this.outputDir}${directory}/${path.dirname(filename)}`
      if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
      }
      
      let filePath = `${this.outputDir}${directory}/${filename}`;
      if(!fs.existsSync(filePath)) {
        console.log(`Downloading Blob: ${filename}`);
        const downloadBlockBlobResponse = await blockBlobClient.downloadToFile(filePath);
      }
      else {
        console.log(`Skipping item:: ${filename}`);
      }
      return filename;
    }
    catch (err) {
      console.log(JSON.stringify(err));
      return null;
    }
    //TODO Technical debt: file.contentMD5    
   
  }

  public async uploadBlob(localFilePath: string) {
    const filename = path.basename(localFilePath);
    const containerClient = this.blobServiceClient.getContainerClient(this.outputBlobContainer);
    const blockBlobClient = await containerClient.getBlockBlobClient(filename);

    // Parallel uploading a Readable stream with BlockBlobClient.uploadStream() in Node.js runtime
    // BlockBlobClient.uploadStream() is only available in Node.js
    try {
      await blockBlobClient.uploadStream(fs.createReadStream(localFilePath), 4 * 1024 * 1024, 20, {
        abortSignal: AbortController.timeout(30 * 60 * 1000), // Abort uploading with timeout in 30mins
        onProgress: (ev) => console.log(ev)
      });
      console.log("uploadStream succeeds");
    } catch (err) {
      console.log(
        `uploadStream failed, requestId - ${err.details.requestId}, statusCode - ${err.statusCode}, errorCode - ${err.details.errorCode}`
      );
    }
    
  }
}
