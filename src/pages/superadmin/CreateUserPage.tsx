import React, { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Chip // Added to style roles inside the table cells nicely
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { IconEye, IconEyeOff, IconUserPlus, IconUsers } from "@tabler/icons-react";

import { usersApi } from "../../api/helpers/users-api/users-api.helper";
import type { CreateUserInput } from "../../api/helpers/users-api/users-api.helper";
import { iamApi } from "../../api/helpers/iam-api/iam-api.helper";
import type { RoleItem } from "../../api/helpers/iam-api/iam-api.types";

// Updated to match your new API response schema payload structure
interface UserListItem {
    id: number;
    firstname: string;
    lastname: string;
    userEmail: string;
    assignedRoles: {
        id: number;
        roleName: string;
    }[];
}

function CreateUserPage() {
    // Form State
    const [formData, setFormData] = useState<CreateUserInput>({
        firstname: "",
        lastname: "",
        userEmail: "",
        password: "",
        assignedRoles: [],
    });

    // Lists & Async Tracking States
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Submission UI States
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Load data dependencies on initialization 
    const loadPageData = async () => {
        try {
            setFetchLoading(true);
            setFetchError(null);

            const [usersData, rolesData] = await Promise.all([
                usersApi.getAllUsers().catch(() => []),
                iamApi.getAllRoles().catch(() => [])
            ]);

            setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);

            if (Array.isArray(rolesData)) {
                setRoles(rolesData);
            } else if (rolesData && Array.isArray((rolesData as any).data)) {
                setRoles((rolesData as any).data);
            } else if (rolesData && Array.isArray((rolesData as any).roles)) {
                setRoles((rolesData as any).roles);
            } else {
                setRoles([]);
            }
        } catch (err: any) {
            setFetchError("Failed to initialize system core dependencies.");
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        loadPageData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (event: SelectChangeEvent<string | string[]>) => {
        const { value } = event.target;
        const nextValue = Array.isArray(value) ? value : value.split(",");

        setFormData((prev) => ({
            ...prev,
            assignedRoles: nextValue.map((roleId) => Number(roleId)),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await usersApi.createUser(formData);

            setSuccess(true);
            setFormData({
                firstname: "",
                lastname: "",
                userEmail: "",
                password: "",
                assignedRoles: [],
            });

            // Re-fetch users list to dynamically populate the table update
            const updatedUsers = await usersApi.getAllUsers();
            setUsers(Array.isArray(updatedUsers) ? updatedUsers : updatedUsers.users || []);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Something went wrong while creating the user."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 4, px: 3 }}>
            <Grid container spacing={4}>

                {/* LEFT SECTION: Users Directory Table */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={3} sx={{ p: 4, height: "100%", minHeight: 500 }}>
                        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <IconUsers size={28} />
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                Registered Users
                            </Typography>
                        </Box>

                        {fetchLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                <CircularProgress />
                            </Box>
                        ) : fetchError ? (
                            <Alert severity="error">{fetchError}</Alert>
                        ) : (
                            <TableContainer sx={{ maxHeight: 520 }}>
                                <Table stickyHeader aria-label="users directory table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold" }}>Sl. No.</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Email Address</TableCell>
                                            {/* New Roles Column Header */}
                                            <TableCell sx={{ fontWeight: "bold" }}>Assigned Roles</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    No registered users found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.map((user, idx) => (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>
                                                        {`${user.firstname} ${user.lastname}`}
                                                    </TableCell>
                                                    <TableCell>{user.userEmail}</TableCell>
                                                    {/* New Roles Column Mapping */}
                                                    <TableCell>
                                                        {user.assignedRoles && user.assignedRoles.length > 0 ? (
                                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                                {user.assignedRoles.map((role) => (
                                                                    <Chip
                                                                        key={role.id}
                                                                        label={role.roleName}
                                                                        size="small"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                    />
                                                                ))}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" color="text.secondary">
                                                                No Roles Assigned
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

                {/* RIGHT SECTION: The Registration Form */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                            <IconUserPlus size={28} />
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                Create New User
                            </Typography>
                        </Box>

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                User created successfully!
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* First Name */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="First Name"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        slotProps={{ htmlInput: { maxLength: 50 } }}
                                    />
                                </Grid>

                                {/* Last Name */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Last Name"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        slotProps={{ htmlInput: { maxLength: 50 } }}
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="email"
                                        label="Email Address"
                                        name="userEmail"
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        slotProps={{ htmlInput: { maxLength: 100 } }}
                                    />
                                </Grid>

                                {/* Password */}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        slotProps={{
                                            htmlInput: { maxLength: 200 },
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Multi-Select Roles Field */}
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth required>
                                        <InputLabel id="assigned-roles-label">Assign Roles</InputLabel>
                                        <Select
                                            labelId="assigned-roles-label"
                                            id="assigned-roles-select"
                                            multiple
                                            value={formData.assignedRoles.map(String)}
                                            onChange={handleRoleChange}
                                            input={<OutlinedInput label="Assign Roles" />}
                                            // Fixed: Updated to match MUI v9 Menu slot architecture
                                            MenuProps={{
                                                slotProps: {
                                                    paper: {
                                                        style: {
                                                            maxHeight: 250,
                                                            width: 250,
                                                        },
                                                    },
                                                },
                                            }}
                                            renderValue={(selectedIds) => {
                                                const selectedValues = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
                                                const selectedSet = new Set(selectedValues.map(String));
                                                return roles
                                                    .filter((r) => selectedSet.has(String(r.id)))
                                                    .map((r) => r.roleName)
                                                    .join(", ");
                                            }}
                                        >
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    <Checkbox checked={formData.assignedRoles.indexOf(role.id) > -1} />
                                                    <ListItemText primary={role.roleName} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Submit Button */}
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        disabled={loading || fetchLoading}
                                        sx={{ py: 1.5 }}
                                    >
                                        {loading ? "Creating..." : "Register User"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
}

export default CreateUserPage;