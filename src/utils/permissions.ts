export const hasPermission = (permissions: string[] = [], permission?: string) => {
    if (!permission) {
        return true;
    }

    return permissions.includes(permission);
};
