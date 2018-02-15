export interface modelUI {
  id: string;
  name: string;
}

export interface MapTree {
  [index: number]: {
    fromPath?: string[];
    toPath?: string[];
    // If any value for this is provided
    // Any value from 'from' model for this
    // path will be overridden by this.
    toValue?: any;
    // This is a function
    // whatever is got from the FROM value
    // will be given as an argument to this function
    toFunction?: any;
  };
  length: number;
}

export interface Mapper<I, O> {
  uiToServiceMapTree: MapTree;
  serviceToUiMapTree: MapTree;
  toUIModel(data: I): O;
  toServiceModel(data: O): I;
}

export function switchModel<I, O>(input: I, mapTree: MapTree): O {
  let output: O = {} as O;
  for (let i = 0; i < mapTree.length; i++) {
    const fromPath = mapTree[i].fromPath;

    // Either their should be a servicePath
    // Or their should be a default value for UI model
    if ((!mapTree[i].hasOwnProperty('fromPath') || !mapTree[i].fromPath.length) &&
          !mapTree[i].hasOwnProperty('toValue')) {
      throw(
        'No from path or default value for \'to\' model is provided at index - `${i}` !'
      );
    }

    if (!mapTree[i].hasOwnProperty('toPath') || !mapTree[i].toPath.length) {
      throw(
        'No to path provided at index - `${i}` !'
      );
    }
    const toPath = mapTree[i].toPath;
    if (mapTree[i].hasOwnProperty('toValue')) {
      updateObj(output, toPath, mapTree[i].toValue);
    } else {
      let fromCurrentVal: any = input;
      if (fromCurrentVal !== null && typeof(fromCurrentVal) !== 'undefined') {
        // Get the value to be mapped from service model
        for(let j = 0; j < fromPath.length; j++) {
          if (fromCurrentVal.hasOwnProperty(fromPath[j])) {
            fromCurrentVal = fromCurrentVal[fromPath[j]];
          } else {
            fromCurrentVal = null;
            break;
          }
        }
      } else {
        fromCurrentVal = null;
      }
      if (
        mapTree[i].hasOwnProperty('toFunction') &&
        typeof(mapTree[i]['toFunction']) === 'function'
      ) {
        updateObj(
          output, toPath,
          mapTree[i].toFunction(fromCurrentVal)
        );
      } else {
        updateObj(output, toPath, fromCurrentVal);
      }
    }
  }
  return output;
}


function updateObj(obj: Object, keyPath: string[], value: any) {
  const lastKeyIndex = keyPath.length-1;
  for (var i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    if (!(key in obj))
      obj[key] = {}
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}


/**
 *
 * @param obj the object to be cleaned
 * @param keys the keys in the object to be clened
 *
 * Any property with value null will be deleted
 * Any property mentioned in the key array will be deleted
 */
export function cleanObject(obj: any, keysToRemove: string[] = []): any {
  const allKeys = Object.keys(obj);
  for (let i = 0; i < allKeys.length; i++) {
    if (obj[allKeys[i]] === null ||
      keysToRemove.findIndex(k => k === allKeys[i]) > -1) {
      delete obj[allKeys[i]];
    } else if (
      typeof(obj[allKeys[i]]) === 'object' &&
      !Array.isArray(obj[allKeys[i]])
    ) {
      obj[allKeys[i]] = cleanObject(obj[allKeys[i]], keysToRemove);
      if (!Object.keys(obj[allKeys[i]]).length) {
        delete obj[allKeys[i]];
      }
    }
  }
  return obj;
}
