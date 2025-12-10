import fs from 'fs';
import path from 'path';

export function logCart(message: string, data: any = {}) {
    try {
        const logPath = path.join(process.cwd(), 'logs', 'cart.log');
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message} \nData: ${JSON.stringify(data, null, 2)}\n-------------------\n`;
        fs.appendFileSync(logPath, logEntry);
    } catch (e) {
        console.error("Failed to write to log file", e);
    }
}
