import { getCircleKeys, chordsTextToString, transposeChordsText, changeChordsTextNotation, chordsTextFromPlainText } from "@titovtima/music-theory";

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

const keys = getCircleKeys();

export function getTransposedText(text: string, original: number, shift: number, reduceSpaces: boolean) {
    const settings: any = useCookie('settings');
    return chordsTextToString(transposeChordsText(
        changeChordsTextNotation(
            chordsTextFromPlainText(text, 'English'),
            settings.notation,
            reduceSpaces),
        keys[toValue(original)],
        keys[(toValue(original) + shift) % 12 + ((toValue(original) < 12) ? 0 : 12)],
        reduceSpaces));
}

export const functionsRefs = {
    saveFunction: ref(() => {}),
}
