export default defineNuxtRouteMiddleware((to, from) => {
    const navState: any = useState('navigation');
    if (navState.value)
        navState.value.listId = null;
    const canEdit = useState('canEdit', () => false);
    canEdit.value = false;
    const editMode = useState('editMode', () => false);
    editMode.value = false;
    const saveFunction = functionsRefs.saveFunction;
    saveFunction.value = () => {};
    useState('watchScroll', () => false).value = false;
});
