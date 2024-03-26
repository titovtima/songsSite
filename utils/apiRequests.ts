import {integer} from "vscode-languageserver-types";

const apiRequests = {
    apiUrl: 'https://test.songs.titovtima.ru/api/v1',
    token: null,

    baseRequest: async (url: string, config: RequestInit = {}) => {
        let response: Response;
        try {
            response = await fetch(apiRequests.apiUrl + url, config);
        } catch (err) {
            return new Promise((resolve, reject) => reject('Fetch error'));
        }
        if (response.ok) {
            return response.json();
        }
        return new Promise((resolve, reject) => reject(response));
    },

    getJWT: async (username: string, password: string) => {
        let result = apiRequests.baseRequest('/login', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password})
        });
        result.then(response => {
            apiRequests.token = response.token;
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        });
    },

    authorizedRequest: async (url: string, config: RequestInit = {}) => {
        if (parseJwt(apiRequests.token)['created_at'] < new Date()) {
            let username = localStorage.getItem('username');
            let password = localStorage.getItem('password');
            if (username == null || password == null)
                return new Promise((resolve, reject) => reject({status: 401}))
            try {
                await apiRequests.getJWT(username, password)
            } catch (e) {
                return new Promise((resolve, reject) => reject({status: 401}))
            }
        }
        let newConfig: any = config;
        if (!newConfig.headers)
            newConfig.headers = {};
        newConfig.headers['Authorization'] = 'Bearer ' + apiRequests.token;
        return apiRequests.baseRequest(url, newConfig);
    },

    optionallyAuthorizedRequest: async (url: string, config: RequestInit = {}) => {
        try {
            return await apiRequests.authorizedRequest(url, config);
        } catch (e) {
            return apiRequests.baseRequest(url, config);
        }
    },

    getSong: async (songId: integer)=> {
        return apiRequests.optionallyAuthorizedRequest('/song/' + songId);
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
