import { cloneWithDepth, getHost, userData } from "./global";

const apiRequests = {
    apiUrl: 'https://' + getHost() + '/api/v1',
    // apiUrl: 'http://127.0.0.1:2403/api/v1', // for testing
    // apiUrl: 'https://test.songs.titovtima.ru/api/v1', // for testing
    tokenCookie: 'auth_token',

    baseRequest: async (url: string, config: RequestInit = {}) => {
        let response: any;
        try {
            response = await fetch(apiRequests.apiUrl + url, config);
        } catch (err) {
            return new Promise((resolve, reject) => reject('Fetch error:\n' + err));
        }
        if (response.ok) {
            return response.json().catch(() => {});
        }
        return new Promise((resolve, reject) => reject(response));
    },

    login: async(username: string, password: string) => {
        try {
            let response = await apiRequests.baseRequest('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            document.cookie = apiRequests.tokenCookie + '=' + response.token + '; path=/; max-age=' + 3600*24*365*100;
            return apiRequests.checkAuthorized();;
        }
        catch(err) {
            return new Promise((resolve, reject) => reject({status: 401}));
        }
    },

    checkAuthorized: async() => {
        let token = useCookie(apiRequests.tokenCookie).value;
        if (!token)
            return new Promise((resolve, reject) => reject({status: 401}));
        let response = apiRequests.authorizedRequest('/users/me').then(response => { userData.value = response; });
        return response;
    },

    authorizedRequest: async (url: string, config: RequestInit = {}) => {
        if (!useCookie(apiRequests.tokenCookie).value)
            return new Promise((resolve, reject) => reject({status: 401}));
        let newConfig: any = cloneWithDepth(config, 1);
        if (!newConfig.headers)
            newConfig.headers = {};
        newConfig.headers['Authorization'] = 'Bearer ' + useCookie(apiRequests.tokenCookie).value;
        return apiRequests.baseRequest(url, newConfig);
    },

    optionallyAuthorizedRequest: async (url: string, config: RequestInit = {}) => {
        try {
            return await apiRequests.authorizedRequest(url, config);
        } catch (e) {
            return apiRequests.baseRequest(url, config);
        }
    },

    register: async (username: string, email: string, password: string) => {
        let body: any = { username: username, password: password };
        if (email.length > 0) {
            body.email = email;
        }
        try {
            await apiRequests.baseRequest('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
        } catch(response: any) {
            try {
                let errorResponse = await response.json();
                return Promise.reject(errorResponse.errorCode);
            } catch(e) {
                return Promise.reject(response.status);
            }
        }
    },

    getSong: async (songId: number) => {
        return apiRequests.optionallyAuthorizedRequest('/song/' + songId);
    },

    postSong: async (songId: string, data: any) => {
        return apiRequests.authorizedRequest('/song/' + songId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
    },

    getSongRights: async (songId: number) => {
        return apiRequests.authorizedRequest('/song/' + songId + '/rights');
    },

    postSongRights: async (songId: number, data: any) => {
        return apiRequests.authorizedRequest('/song/' + songId + '/rights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
    },

    getMainListInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/main_list/info');
    },

    getMainList: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/main_list');
    },

    getAllSongsInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/info');
    },

    getAllSongs: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs');
    },

    getListInfo: async (listId: number) => {
        return apiRequests.optionallyAuthorizedRequest('/songs_list/' + listId + '/info');
    },

    getListSongsInfo: async (listId: number) => {
        return apiRequests.optionallyAuthorizedRequest('/songs_list/' + listId + '/songs_info');
    },

    getListData: async (listId: number) => {
        return apiRequests.optionallyAuthorizedRequest('/songs_list/' + listId);
    },

    postListData: async (listId: string, data: any) => {
        return apiRequests.authorizedRequest('/songs_list/' + listId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
    },

    getListRights: async (listId: number) => {
        return apiRequests.optionallyAuthorizedRequest('/songs_list/' + listId + '/rights');
    },

    getAllListsInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs_lists/info');
    },

    getArtistsList: async () => {
        return apiRequests.baseRequest('/artists');
    },

    getAudioLink: (uuid: string) => apiRequests.apiUrl + '/audio/' + uuid,

    postAudio: async (file: File) => {
        return apiRequests.authorizedRequest('/audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'audio/mpeg',
            },
            body: file,
        });
    },
};

export default apiRequests;

function parseJwt(token: any) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
