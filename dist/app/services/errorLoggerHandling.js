import { formattedDate } from '../utils/formattedDate.js';
import * as fs from 'fs';
import { resolve } from 'path';
const __dirname = resolve(`.`);
import debug from 'debug';
const logger = debug('ErrorHandling');
function errorLoggerHandling(message, req, res) {
    const actualDate = new Date();
    const logMessage = `${actualDate.toLocaleString()} - ${req.url} - ${message}\r`;
    const fileName = `${formattedDate}.log`;
    fs.appendFile((`${__dirname}/logs/${fileName}`), logMessage, (error) => {
        if (error)
            logger(error);
    });
}
export { errorLoggerHandling };
//# sourceMappingURL=errorLoggerHandling.js.map