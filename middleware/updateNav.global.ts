export default defineNuxtRouteMiddleware((to, from) => {
    const navState: any = useState('navigation', () => { 
        return { 
            listId: null, 
            prev: null, 
            showCopyLink: false,
            onlyMain: false,
        };
    });
    if (navState.value)
        navState.value.listId = null;
    const canEdit = useState('canEdit', () => false);
    canEdit.value = false;
    const editMode = useState('editMode', () => false);
    editMode.value = false;
    const saveFunction = functionsRefs.saveFunction;
    saveFunction.value = () => {};
    useState('watchScroll', () => false).value = false;

    if (to.path.startsWith('/reset_password')) {
        navState.value.showCopyLink = false;
        navState.value.onlyMain = true;
    } else {
        navState.value.showCopyLink = true;
        navState.value.onlyMain = false;
    }
});
