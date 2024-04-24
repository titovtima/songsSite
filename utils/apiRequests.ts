const apiRequests = {
    apiUrl: '/api/v1',
    token: null,

    baseRequest: async (url: string, config: any) => {
        let response: any;
        try {
            response = await useFetch(apiRequests.apiUrl + url, config);
        } catch (err) {
            return new Promise((resolve, reject) => reject('Fetch error'));
        }
        if (response.status.value == 'success') {
            return response.data.value;
        }
        return new Promise((resolve, reject) => reject(response));
    },

    getJWT: async (username: string, password: string) => {
        let result = apiRequests.baseRequest('/login', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password})
        });
        result.then((response: any) => {
            apiRequests.token = response.token;
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        });
    },

    authorizedRequest: async (url: string, config: RequestInit = {}) => {
        if (process.server) return new Promise((resolve, reject) => reject({status: 401}));
        if (apiRequests.token == null || parseJwt(apiRequests.token)['exp'] < new Date()) {
            let username = localStorage.getItem('username');
            let password = localStorage.getItem('password');
            if (username == null || password == null)
                return new Promise((resolve, reject) => reject({status: 401}));
            try {
                await apiRequests.getJWT(username, password);
            } catch (e) {
                return new Promise((resolve, reject) => reject({status: 401}));
            }
        }
        let newConfig: any = config;
        if (!newConfig.headers)
            newConfig.headers = {};
        newConfig.headers['Authorization'] = 'Bearer ' + apiRequests.token;
        return apiRequests.baseRequest(url, newConfig);
    },

    optionallyAuthorizedRequest: async (url: string, config: RequestInit = {}) => {
        if (process.client) {
            try {
                return await apiRequests.authorizedRequest(url, config);
            } catch (e) {
                return apiRequests.baseRequest(url, config);
            }
        } else {
            return apiRequests.baseRequest(url, config);
        }
    },

    getSong: async (songId: number)=> {
        return apiRequests.optionallyAuthorizedRequest('/song/' + songId);
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
