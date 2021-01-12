import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ProductoSentinelReadyDTO } from '../../shared/models/ProductoSentinel';
import { basename, dirname } from 'path';

const exec = cp.exec;
const binaryPath = process.env.BINARY_PATH ?? '/app/application';
const sharedDiskPath = process.env.FAST_DISK_MOUNT_DIR ?? '/app/data';

export default class ProcessManager{

  public binaryPath = binaryPath;
  protected processId : string | null = null;
  protected sharedDiskBasePath = sharedDiskPath;

  async run(input: ProductoSentinelReadyDTO) {
    if(!this.validatePlatform())
    {
      return false;
    }
    
    const _this = this;

    // Validate input

    let dataFolder = 'workplan_' + input.workPlan.pasadaId + '_' + input.workPlan.esquemaTileId;
    let workPlanFilePath = `${this.sharedDiskBasePath}/${dataFolder}/workplan.json`;
    let outputPath = `${this.sharedDiskBasePath}/output/${dataFolder}`;
    fs.writeFileSync(workPlanFilePath, JSON.stringify(input));

    //Build argument list
    let args = `-rawData -s "${this.sharedDiskBasePath}/${dataFolder}/" -l "${this.sharedDiskBasePath}/lotes/" -f "${workPlanFilePath}"  -o "${outputPath}" -p "${this.sharedDiskBasePath}/cultivosxLotes.json"`;

    console.log(args);

    const childProcessObj = exec(this.binaryPath + ' ' + args, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      console.log('Child Process STDOUT: '+stdout);
      console.log('Child Process STDERR: '+stderr);
    });

    let basename = path.basename(this.binaryPath);
    console.log(basename);
    this.processId = basename;
    
    childProcessObj.on('exit', function (code) {
      console.log('Child process exited with exit code '+code);
  
      _this.processId = null;
    });

    return true;    
  }


  isRunning = (cb: any) => {
    console.log(this.processId);

    if (!this.processId || this.processId == null) cb(false);

    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${this.processId}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        let pid = this.processId;
        if (pid) {
          cb(stdout.toLowerCase().indexOf(pid) > -1);
        }
        cb(false);
    });
  }

  //perform init validations
  validatePlatform() : boolean {
    try { 
      fs.accessSync(this.binaryPath, fs.constants.X_OK);
      let paths = [
        `${this.sharedDiskBasePath}/output/`
      ];
      paths.forEach((dir) => {
        fs.mkdirSync(dir, { "recursive": true });
      });
      return true;
    } catch (err) { 
      console.log(err);
      return false;
    } 
  }
  
}