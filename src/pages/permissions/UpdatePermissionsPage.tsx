import React, { useEffect } from 'react';
import {
    List,
    Divider,
    CardHeader,
    Stack,
    Paper,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { type PermissionType, type Role } from './permissions.type';
import { iamApi } from '../../api/helpers/iam-api/iam-api.helper';
import { useParams } from 'react-router';

const UpdatePermissionsPage = () => {
    const { permissionId } = useParams()

    const [roles, setRoles] = React.useState<Role[]>([]);

    // 1. Centralized State: Stores only the IDs that are on the RIGHT side for each permission type
    const [permissions, setPermissions] = React.useState<Record<PermissionType, number[]>>({
        add: [],
        edit: [],
        delete: [],
        view: [],
    });

    // 2. Global checked state tracks: "permissionType-roleId" (e.g., "add-3")
    const [checked, setChecked] = React.useState<string[]>([]);

    useEffect(() => {
        if (!permissionId || Number.isNaN(Number(permissionId))) {
            return;
        }

        async function fetchPermissionRoles(id: number) {
            try {
                const permissionResponse = await iamApi.getPermissionRoles(id);
                const permissionRoles = permissionResponse.data.roles;

                setRoles(permissionRoles.map((item) => ({
                    id: item.role.id,
                    name: item.role.roleName,
                })));

                setPermissions({
                    add: permissionRoles.filter((item) => item.canAdd).map((item) => item.role.id),
                    edit: permissionRoles.filter((item) => item.canEdit).map((item) => item.role.id),
                    delete: permissionRoles.filter((item) => item.canDelete).map((item) => item.role.id),
                    view: permissionRoles.filter((item) => item.canRead).map((item) => item.role.id),
                });
            } catch (error) {
                console.error("Failed to load permission roles:", error);
            }
        }

        fetchPermissionRoles(Number(permissionId));
    }, [permissionId]);

    // Helper to toggle selection checkboxes
    const handleToggle = (type: PermissionType, id: number) => () => {
        const key = `${type}-${id}`;
        const currentIndex = checked.indexOf(key);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(key);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    // Calculate columns dynamically for a specific permission type
    const getColumns = (type: PermissionType) => {
        const rightIds = permissions[type];
        const right = roles.filter(role => rightIds.includes(role.id));
        const left = roles.filter(role => !rightIds.includes(role.id));

        const leftChecked = left.filter(role => checked.includes(`${type}-${role.id}`));
        const rightChecked = right.filter(role => checked.includes(`${type}-${role.id}`));

        return { left, right, leftChecked, rightChecked };
    };

    // Move checked roles from Left to Right (Grant Permission)
    const handleMoveRight = (type: PermissionType) => () => {
        const { leftChecked } = getColumns(type);
        const idsToMove = leftChecked.map(r => r.id);

        setPermissions(prev => ({
            ...prev,
            [type]: [...prev[type], ...idsToMove]
        }));

        // Clear checkboxes for moved items
        setChecked(prev => prev.filter(key => !idsToMove.map(id => `${type}-${id}`).includes(key)));
    };

    // Move checked roles from Right to Left (Revoke Permission)
    const handleMoveLeft = (type: PermissionType) => () => {
        const { rightChecked } = getColumns(type);
        const idsToRemove = rightChecked.map(r => r.id);

        setPermissions(prev => ({
            ...prev,
            [type]: prev[type].filter(id => !idsToRemove.includes(id))
        }));

        // Clear checkboxes for moved items
        setChecked(prev => prev.filter(key => !idsToRemove.map(id => `${type}-${id}`).includes(key)));
    };

    // Render a single column panel (Left or Right)
    const renderPanel = (title: string, type: PermissionType, roles: Role[]) => {
        const panelChecked = roles.filter(role => checked.includes(`${type}-${role.id}`));
        const isAllChecked = roles.length > 0 && panelChecked.length === roles.length;
        const isIndeterminate = panelChecked.length > 0 && panelChecked.length < roles.length;

        const handleToggleAll = () => {
            const keys = roles.map(role => `${type}-${role.id}`);
            if (isAllChecked) {
                setChecked(prev => prev.filter(k => !keys.includes(k)));
            } else {
                setChecked(prev => [...new Set([...prev, ...keys])]);
            }
        };

        return (
            <Paper variant="outlined">
                <CardHeader
                    sx={{ px: 2, py: 1 }}
                    avatar={
                        <Checkbox
                            onClick={handleToggleAll}
                            checked={isAllChecked}
                            indeterminate={isIndeterminate}
                            disabled={roles.length === 0}
                        />
                    }
                    title={title}
                    subheader={`${panelChecked.length}/${roles.length} selected`}
                />
                <Divider />
                <List sx={{ width: 180, height: 200, overflow: 'auto' }} dense>
                    {roles.map((role) => {
                        const isRoleChecked = checked.includes(`${type}-${role.id}`);
                        return (
                            <ListItemButton key={role.id} onClick={handleToggle(type, role.id)}>
                                <ListItemIcon>
                                    <Checkbox checked={isRoleChecked} disableRipple size="small" />
                                </ListItemIcon>
                                <ListItemText primary={role.name} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Paper>
        );
    };

    // Render one row representing one permission metric (Add, Edit, etc.)
    const renderPermissionRow = (type: PermissionType, label: string) => {
        const { left, right, leftChecked, rightChecked } = getColumns(type);

        return (
            <Grid container sx={{
                spacing: 2, alignItems: "center", mb: 4, justifyContent: 'center'
            }
            }>
                <Grid sx={{ xs: 2 }}>
                    <Typography sx={{ variant: "subtitle1", fontWeight: "bold", textAlign: "right", pr: 2 }}>
                        {label}
                    </Typography>
                </Grid>
                <Grid>{renderPanel('Available Roles', type, left)}</Grid>
                <Grid>
                    <Stack spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleMoveRight(type)}
                            disabled={leftChecked.length === 0}
                        >
                            <IconChevronRight width={16} height={16} />
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleMoveLeft(type)}
                            disabled={rightChecked.length === 0}
                        >
                            <IconChevronLeft width={16} height={16} />
                        </Button>
                    </Stack>
                </Grid>
                <Grid>{renderPanel('Assigned Roles', type, right)}</Grid>
            </Grid >
        );
    };

    return (
        <Stack sx={{ p: 4 }}>
            <Typography sx={{ variant: "h5", mb: 4, textAlign: "center" }}>
                Manage Role Permissions
            </Typography>
            {renderPermissionRow('add', 'Add Action')}
            {renderPermissionRow('edit', 'Edit Action')}
            {renderPermissionRow('delete', 'Delete Action')}
            {renderPermissionRow('view', 'View Action')}
        </Stack>
    );
};

export default UpdatePermissionsPage;
