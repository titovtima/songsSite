export function clone(object: any): any {
    if (typeof object != 'object') 
        return object;
    if (object.isArray) {
        let result = [];
        for (let a of object) {
            result.push(clone(a));
        }
        return result;
    } else {
        let result: any = {};
        for (let f in object) {
            result[f] = clone(object[f]);
        }
        return result;
    }
}
