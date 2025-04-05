type SongPart = {
    type: string,
    ord: number,
    name: string | null,
    data: string,
    key: number | null
}

type Artist = {
    id: number,
    name: string
}

type SongPerformance = {
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

type Song = {
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

type SongsList = {
    id: number,
    name: string,
    owner: string,
    public: boolean,
    listIds: number[]
}

export const userData: Ref<any> = ref(null);
export const songsData: Ref<Array<Song>> = ref([]);
export const listsData: Ref<Array<SongsList>> = ref([]);

let storageSongsDataString = localStorage.getItem("songsData")
if (storageSongsDataString != null) {
    let storageSongsData = JSON.parse(storageSongsDataString)
    songsData.value = storageSongsData;
}

export function getAllSongsData(): Ref<Array<Song>> {
    apiRequests.getAllSongs().then(response => {
        songsData.value = response;
    });
    return songsData;
}

export function getMainListData(): Ref<Array<Song>> {
    getAllSongsData();
    return computed(() => songsData.value.filter(song => song.inMainList));
}

export function getListInfo(listId: number): Ref<SongsList> {
    getAllSongsData();
    apiRequests.getListData(listId).then(response => {
        listsData.value[listId] = response.map(
            (value: {list: Song[], listIds?: number[]}) => value.listIds = value.list.map(song => song.id));

    });
    return computed(() => listsData.value[listId]);
}

export function getSongData(songId: number): Ref<Song> {
    apiRequests.getSong(songId).then(response => {
        songsData.value[songId] = response;
    });
    return computed(() => songsData.value[songId]);
}
