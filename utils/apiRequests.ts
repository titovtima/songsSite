import { clone } from "./global";

const apiRequests = {
    apiUrl: 'https://songs.istokspb.org/api/v1',
    // apiUrl: 'http://127.0.0.1:2403/api/v1', // for testing
    tokenCookie: 'auth_token',

    baseRequest: async (url: string, config: RequestInit = {}) => {
        let response: any;
        try {
            response = await fetch(apiRequests.apiUrl + url, config);
        } catch (err) {
            return new Promise((resolve, reject) => reject('Fetch error'));
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
            // let cookie = useCookie(apiRequests.tokenCookie);
            // cookie.value = response.token;
            document.cookie = apiRequests.tokenCookie + '=' + response.token;
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
        let response = apiRequests.authorizedRequest('/users/me');
        response.then(response => {
            useState('userData').value = response;
        }).catch(() => {});
        return response;
    },

    authorizedRequest: async (url: string, config: RequestInit = {}) => {
        if (!useCookie(apiRequests.tokenCookie).value)
            return new Promise((resolve, reject) => reject({status: 401}));
        let newConfig: any = clone(config);
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

    getMainListInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/main_list/info');
    },

    getMainList: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/main_list');
    },

    getAllSongsInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs/info');
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

    getAllListsInfo: async () => {
        return apiRequests.optionallyAuthorizedRequest('/songs_lists/info');
    }
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
