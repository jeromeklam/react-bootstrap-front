/**
 * Retrieve via an accessor-like property
 *
 *    accessor(obj, 'name')   // => retrieves obj['name']
 *    accessor(data, func)    // => retrieves func(data)
 *    ... otherwise null
 */
export function accessor(data, field) {
  var value = null
  if (data !== null) {
    if (typeof field === 'function') {
      value = field(data)
    } else {
      if ( typeof field === 'string' && typeof data === 'object') {
        if (data[field]) {
          value = data[field]
        } else {
          let parts = field.split('.');
          let tempo = data;
          while (parts.length > 0 && tempo) {
            const fld = parts[0];
            parts.shift();
            if (tempo[fld]) {
              tempo = tempo[fld];
            } else {
              tempo = null;
            }
          }
          value = tempo;
        }
      }
    }
  }
  return value;
}

export const wrapAccessor = acc => data => accessor(data, acc)
