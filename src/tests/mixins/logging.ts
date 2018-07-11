import { debug, info } from '../support';

export class Logging {
  name: string = '';

  log(action: string, ...msg: string[]) {
    let className = this.constructor.name;
    info(`${action}: ${className}('${this.name}')`, ...msg);
  }

  debug(context: string, ...msg: string[]) {
    let className = this.constructor.name;
    debug(`... ${className}('${this.name}'): ${context}`, ...msg);
  }
}
