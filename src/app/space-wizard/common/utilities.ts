  export function formatJson(obj: any, indent: number= 0): string {
    let t = '';
    let s: string = ' ';
    let ar = {
      start: '[',
      end: ']'
    };
    let op = {assign: ` => `};

    s = s.repeat(indent);
    {
      if ( Array.isArray(obj)) {
        let count = 0;
        for ( let item of obj) {
          count++;
          t = `${t}${s}\n${ar.start}${formatJson(item, indent + 1)}\n${s}${ar.end}${count < obj.length ? ',' : ''}`;
        }
      } else {
        for (let p in obj) {
          if (obj.hasOwnProperty(p)) {
            if (Array.isArray(obj[p])) {
              t = `${t}\n${s}${p}${op.assign}${ar.start}${formatJson(obj[p], indent + 1)}${ar.end}`;
            } else if (typeof(obj[p]) !== 'function') {
              if (typeof(obj[p]) === 'object') {
                t = `${t}\n${s}${p}${op.assign}${formatJson(obj[p], indent + 1)}`;
              } else {
                t = `${t}\n${s}${p}${op.assign}${obj[p]}`;
              }
            }
          }
        }
      }
    }
    return `${t}`;
  }

  export function clone<T>(value: any): T {
    return  <T>JSON.parse(JSON.stringify( value || {} ));
  }
