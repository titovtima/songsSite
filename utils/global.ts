import musicTheory from '@titovtima/music-theory';
const { getCircleKeys, chordsTextToString, transposeChordsText, changeChordsTextNotation, chordsTextFromPlainText } = musicTheory;

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

export function cloneWithDepth(object: any, depth: number): any {
    if (depth <= 0 || typeof object != 'object') 
        return object;
    if (object.isArray) {
        let result = [];
        for (let a of object) {
            result.push(cloneWithDepth(a, depth - 1));
        }
        return result;
    } else {
        let result: any = {};
        for (let f in object) {
            result[f] = cloneWithDepth(object[f], depth - 1);
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

// export function setDefaultSettings() {
//     let settings: any = useCookie('settings', {path: '/'});
//     if (!settings.value) {
//         settings.value = {};
//     }
//     if (!settings.value.notation) {
//         settings.value.notation = 'English';
//     }
//     if (import.meta.client) {
//         let html = document.documentElement;
//         if (!settings.value.fontSize) {
//             settings.value.fontSize = parseInt(getComputedStyle(html, '').fontSize);
//         }
//     } 
// }

export function getSettings(): Ref<any> {
    let settings: any = useCookie('settings', {path: '/'});
    if (!settings.value) {
        settings.value = {};
    }
    if (!settings.value.notation) {
        settings.value.notation = 'English';
    }
    if (import.meta.client) {
        let html = document.documentElement;
        if (!settings.value.fontSize) {
            settings.value.fontSize = parseInt(getComputedStyle(html, '').fontSize);
        }
    } 
    return settings;
}

export const functionsRefs = {
    saveFunction: ref(() => {}),
}
