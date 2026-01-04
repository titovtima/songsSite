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

export function uniqueFromArr(arr: any[]): any[] {
    return arr.filter((value, index, array) => array.indexOf(value) === index && value != null);
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

export function findInSong(search: string, song: any): boolean {
    let words = search.split(/[^\p{L}]/gu).filter(w => w.length > 0)
    return findWordsInSong(words, song);
} 

export function findWordsInSong(words: any[], song: any): boolean {
    return words.reduce((acc: boolean, word: string) => {
        if (!acc) return false;
        if (song.name.toLowerCase().includes(word)) return true;
        for (let part of song.parts) {
            if (part.data.toLowerCase().includes(word)) return true;
        }
        for (let perf of song.performances) {
            if (perf.songName && perf.songName.toLowerCase().includes(word)) return true;
        }
        return false;
    }, true);
}

export function sortSongs(list: {name: string}[]): any[] {
    return list.sort((song1: { name: string; }, song2: { name: string; }) => {
        if (song1.name < song2.name) return -1;
        if (song1.name > song2.name) return 1;
        else return 0;
    });
}

export function getHost(): string {
    return import.meta.server ?
        (process.env.API_HOST ? process.env.API_HOST : 'songs.istokspb.org') :
        (new URL(window.location.href)).host;
}

export const userData: Ref<any> = ref(null);

export const functionsRefs = {
    saveFunction: ref(() => {}),
}
