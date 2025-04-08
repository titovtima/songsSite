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

const songsData: Ref<Map<number, Song>> = ref(new Map());
const listsData: Ref<Map<number, SongsList>> = ref(new Map());

if (import.meta.client) {
    let storageSongsDataString = localStorage.getItem("songsData");
    if (storageSongsDataString != null) {
        let storageSongsData = JSON.parse(storageSongsDataString);
        if (storageSongsData.get) {
            songsData.value = storageSongsData;
        }
    }
    let storageListsDataString = localStorage.getItem("listsData");
    if (storageListsDataString != null) {
        let storageListsData = JSON.parse(storageListsDataString);
        if (storageListsData.get) {
            listsData.value = storageListsData;
        }
    }
}

export function getAllSongsData(): Ref<Array<Song>> {
    if (import.meta.server) return ref([]);
    apiRequests.getAllSongs().then(response => {
        for (let song of response.list) {
            songsData.value.set(song.id, song);
        }
        localStorage.setItem('songsData', JSON.stringify(songsData.value));
    });
    return computed(() => [...songsData.value.values()]);
}

export function getMainListData(): Ref<Array<Song>> {
    let data = getAllSongsData();
    return computed(() => data.value.filter(song => song.inMainList));
}

export function getListData(listId: number): [Ref<SongsList>, Promise<void>] {
    if (import.meta.server) return [ref(emptySongsList), new Promise(resolve => resolve())];
    let promise = apiRequests.getListData(listId).then(response => {
        listsData.value.set(listId, response);
        localStorage.setItem('listsData', JSON.stringify(listsData.value));
    });
    return [computed(() => {
        let listData = listsData.value.get(listId);
        return listData ? listData : emptySongsList;
    }), promise];
}

export function getSongData(songId: number): [Ref<Song>, Promise<void> ] {
    if (import.meta.server) return [ref(emptySong), new Promise(resolve => resolve())];
    let promise = apiRequests.getSong(songId).then(response => {
        songsData.value.set(songId, response);
        localStorage.setItem('songsData', JSON.stringify(songsData.value));
    });
    return [computed(() => {
        let songData = songsData.value.get(songId);
        return songData ? songData : emptySong;
    }), promise];
}
