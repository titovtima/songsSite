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

export function fitTextareaHeight(element: any) {
    element.style.height = 0;
    element.style.height = element.scrollHeight + 'px';
}

export const functionsRefs = {
    saveFunction: ref(() => {}),
}
