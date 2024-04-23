export default defineNuxtRouteMiddleware((to, from) => {
    const navState: any = useState('navigation');
    if (navState.value)
        navState.value.listId = null;
})