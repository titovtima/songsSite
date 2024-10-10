export default defineNuxtRouteMiddleware((to, from) => {
    const settings: any = useCookie('settings', {path: '/'});
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
});
