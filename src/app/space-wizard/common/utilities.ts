  export function formatJson(source: any, indent: number= 0): string {
    let tmp = '';
    let offset: string = ' ';
    let array = {
      start: '[',
      end: ']'
    };
    let operator = {assign: ` => `};

    offset = offset.repeat(indent);
    {
      if ( Array.isArray(source)) {
        let count = 0;
        for ( let item of source) {
          count++;
          tmp = `${tmp}${offset}\n${array.start}${formatJson(item, indent + 1)}\n${offset}${array.end}${count < source.length ? ',' : ''}`;
        }
      }
      else{
        for (let propertyName in source) {
          if (source.hasOwnProperty(propertyName)) {
            if (Array.isArray(source[propertyName])) {
              tmp = `${tmp}\n${offset}${propertyName}${operator.assign}${array.start}${formatJson(source[propertyName], indent + 1)}${array.end}`;
            } else if (typeof(source[propertyName]) !== 'function') {
              if (typeof(source[propertyName]) === 'object') {
                tmp = `${tmp}\n${offset}${propertyName}${operator.assign}${formatJson(source[propertyName], indent + 1)}`;
              } else {
                tmp = `${tmp}\n${offset}${propertyName}${operator.assign}${source[propertyName]}`;
              }
            }
          }
        }
      }
    }
    let result = `${tmp}`;
    return result;
  }

  export function clone<T>(value: any): T {
    let clone = <T>JSON.parse(JSON.stringify( value || {} ));
    return clone;
  }
