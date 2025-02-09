import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { timestamp } from 'rxjs';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLoggerService extends ConsoleLogger {
    private logFilePath: string;

    constructor() {
        super();
        this.logFilePath = path.join(__dirname, '../../logs/error.log');
        this.ensureLogFileExists();
    }

    private ensureLogFileExists() {
        if (!fs.existsSync(this.logFilePath)) {
            fs.mkdirSync(path.dirname(this.logFilePath), {recursive: true });
            fs.writeFileSync(this.logFilePath, '');
        }
    }

    private async writeLogToFile(entry: object | string) {
        const logEntry = entry instanceof Object ? JSON.stringify(entry) : entry;
        await fs.promises.appendFile(this.logFilePath, logEntry+'\n');
    }

    async error(message: any, stackOrContext?: string) {
        const entry = {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            stackOrContext: stackOrContext ?? '',
            message
        }
        await this.writeLogToFile(entry);
        super.error(message, stackOrContext);
    }
}
