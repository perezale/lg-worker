import { fstat } from "fs/promises";
import * as fs from 'fs';
import { WorkPlanService } from "./grobo-api/WorkPlanService";

export class FastDiskClientService {

  private mntDir;

  public constructor() { 
    this.mntDir = process.env.FAST_DISK_MOUNT_DIR || './data/'
    if (! (this.mntDir.substr(-1) === '/')) {
      this.mntDir += '/';
    }
  }

  public async saveFile(filename:string, content:string) {
    let filepath = this.mntDir + filename;
    if(!fs.existsSync(filepath))
      fs.writeFileSync(filepath, content);
  }
}