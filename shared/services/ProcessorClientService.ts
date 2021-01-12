import { ProductoSentinelReadyDTO } from './dtos/ProductoSentinelReadyDTO';
import { ProcessorService } from './grobo-api/ProcessorService';

export class ProcessorClientService {

    private procService: ProcessorService;

    public constructor() {
        this.procService = new ProcessorService();
    }

    public async run(productosSentinelReady : ProductoSentinelReadyDTO) {
        return await this.procService.postProcessor(productosSentinelReady);
    }

    public async status() {
        return await this.procService.getProcessor();
    }

}