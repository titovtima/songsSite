export type SongPart = {
    type: string,
    ord: number,
    name: string | null,
    data: string,
    key: number | null
}

export type Artist = {
    id: number,
    name: string
}

export type SongPerformance = {
    id: number,
    artists: Artist[],
    songName: string | null,
    link: string | null,
    extra: string | null,
    album: string | null,
    lang: string | null,
    date: string | null,
    key: number | null,
    ord: number,
    bpm: number | null,
    isOriginal: boolean,
    isMain: boolean,
    audio: string | null
}

export type Song = {
    id: number,
    name: string,
    extra: string | null,
    key: number | null,
    owner: string,
    public: boolean,
    inMainList: boolean,
    parts: SongPart[],
    performances: SongPerformance[]
}

export type SongsList = {
    id: number,
    name: string,
    owner: string,
    public: boolean,
    list: number[]
}

export const emptySong = {
    id: -1,
    name: '',
    extra: null,
    key: null,
    owner: '',
    public: false,
    inMainList: true,
    parts: [],
    performances: []
};

export const emptySongsList = {
    id: -1,
    name: '',
    owner: '',
    public: false,
    list: []
};

export const songsData: Ref<Array<Song>> = ref([]);
export const listsData: Ref<Array<SongsList>> = ref([]);

if (import.meta.client) {
    let storageSongsDataString = localStorage.getItem("songsData");
    if (storageSongsDataString != null) {
        let storageSongsData = JSON.parse(storageSongsDataString);
        if (Array.isArray(storageSongsData)) {
            songsData.value = storageSongsData;
        }
    }
    let storageListsDataString = localStorage.getItem("listsData");
    if (storageListsDataString != null) {
        let storageListsData = JSON.parse(storageListsDataString);
        if (Array.isArray(storageListsData)) {
            listsData.value = storageListsData;
        }
    }
}

export function getAllSongsData(): Ref<Array<Song>> {
    if (import.meta.server) return ref([]);
    apiRequests.getAllSongs().then(response => {
        songsData.value = response.list;
        localStorage.setItem('songsData', JSON.stringify(songsData.value));
    });
    return songsData;
}

export function getMainListData(): Ref<Array<Song>> {
    getAllSongsData();
    return computed(() => songsData.value.filter(song => song.inMainList));
}

export function getListData(listId: number): [Ref<SongsList>, Promise<void>] {
    if (import.meta.server) return [ref(emptySongsList), new Promise(resolve => resolve())];
    let promise = apiRequests.getListData(listId).then(response => {
        listsData.value[listId] = response;
        localStorage.setItem('listsData', JSON.stringify(listsData.value));
    });
    return [computed(() => listsData.value[listId]), promise];
}

export function getSongData(songId: number): [Ref<Song>, Promise<void> ] {
    if (import.meta.server) return [ref(emptySong), new Promise(resolve => resolve())];
    let promise = apiRequests.getSong(songId).then(response => {
        songsData.value[songId-1] = response;
        localStorage.setItem('songsData', JSON.stringify(songsData.value));
    });
    return [computed(() => songsData.value[songId-1]), promise];
}
