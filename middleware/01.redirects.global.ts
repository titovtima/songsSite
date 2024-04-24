export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path == '/songs' || to.path == '/songs/')
        return navigateTo('/', { redirectCode: 301 });
});
