import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { iamApi } from "../../api/helpers/iam-api/iam-api.helper";
import type { PermissionItem } from '../../api/helpers/iam-api/iam-api.types';
import { EditNote } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material'
import { useNavigate } from 'react-router';

function PermissionsPage() {
    const [permissions, setPermissions] = useState<PermissionItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getAllPermission() {
            try {
                const res = await iamApi.getAllPermissions();
                setPermissions(res.data || []);
            } catch (error) {
                setPermissions([]);
                console.error(error);
            }
        }
        getAllPermission();
    }, []);


    const handleEdit = (id: number) => {
        navigate(`/permissions/${id}/update-permission`);
    };

    // Helper to render role indicator tags for a given flag
    const renderRoleBadges = (matrixItems: any[], flagKey: string) => {
        const matchingRoles = matrixItems.filter(item => item[flagKey] === true);

        if (matchingRoles.length === 0) return "-";

        return (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {matchingRoles.map((item) => (
                    <Chip
                        key={item.roleId}
                        label={`${item.roleId}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>
        );
    };

    return (
        <div>
            <TableContainer sx={{ minWidth: { sm: '350px' } }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl. No.</TableCell>
                            <TableCell>Permission Name</TableCell>
                            <TableCell>View Roles</TableCell>
                            <TableCell>Add Roles</TableCell>
                            <TableCell>Edit Roles</TableCell>
                            <TableCell>Delete Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map((perm, idx) => (
                            <TableRow key={perm.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>
                                    <Tooltip title={`Update ${perm.permissionName.replace(/_/g, ' ')}`}>
                                        <IconButton aria-label="" onClick={() => handleEdit(perm.id)}>
                                            <EditNote fontSize='inherit' color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                    {perm.permissionName.replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell>{renderRoleBadges(perm.roles || [], 'canRead')}</TableCell>
                                <TableCell>{renderRoleBadges(perm.roles || [], 'canAdd')}</TableCell>
                                <TableCell>{renderRoleBadges(perm.roles || [], 'canEdit')}</TableCell>
                                <TableCell>{renderRoleBadges(perm.roles || [], 'canDelete')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PermissionsPage;