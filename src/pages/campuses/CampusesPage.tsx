import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import PageContainer from "../../components/container/PageContainer";
import CampusForm from "./CampusForm";
import { campusApi, type Campus, type CampusInput } from "../../api/helpers/campus-api/campus-api.helper";
import { useAppSelector } from "../../store/Hooks";
import { hasPermission } from "../../utils/permissions";

const messageFor = (error: unknown) => typeof error === "object" && error !== null && "response" in error ? (error as { response?: { data?: { error?: { message?: string }; message?: string } } }).response?.data?.error?.message ?? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Unable to save campus." : "Unable to save campus.";

export default function CampusesPage() {
    const permissions = useAppSelector((state) => state.permissions.permissions);
    const canManage = hasPermission(permissions, "campus.manage");
    const [campuses, setCampuses] = useState<Campus[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false); const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null); const [saving, setSaving] = useState(false); const [formError, setFormError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null);
    const loadCampuses = useCallback(async () => { setLoading(true); setError(null); try { setCampuses((await campusApi.listCampuses()).items); } catch { setError("Unable to load campuses."); } finally { setLoading(false); } }, []);
    useEffect(() => { void loadCampuses(); }, [loadCampuses]);
    const submit = async (input: CampusInput) => { setSaving(true); setFormError(null); try { if (selectedCampus) await campusApi.updateCampus(selectedCampus.id, input); else await campusApi.createCampus(input); setDialogOpen(false); setSuccess(selectedCampus ? "Campus updated successfully." : "Campus created successfully."); await loadCampuses(); } catch (err) { setFormError(messageFor(err)); } finally { setSaving(false); } };
    const openCreate = () => { setSelectedCampus(null); setFormError(null); setDialogOpen(true); };
    const openEdit = (campus: Campus) => { setSelectedCampus(campus); setFormError(null); setDialogOpen(true); };
    return <PageContainer title="Campuses" description="Campus management"><Box sx={{ p: { xs: 2, sm: 3 } }}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}><Box><Typography variant="h4">Campuses</Typography><Typography color="text.secondary">Campuses available in the current tenant</Typography></Box>{canManage && <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={openCreate}>Add Campus</Button>}</Box>
        {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}
        {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box> : error ? <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void loadCampuses()}>Retry</Button>}>{error}</Alert> : <Paper><TableContainer><Table aria-label="campuses"><TableHead><TableRow><TableCell>Campus name</TableCell><TableCell>Code</TableCell><TableCell>Status</TableCell>{canManage && <TableCell align="right">Actions</TableCell>}</TableRow></TableHead><TableBody>{campuses.length === 0 ? <TableRow><TableCell colSpan={canManage ? 4 : 3} align="center" sx={{ py: 5 }}>No campuses found</TableCell></TableRow> : campuses.map((campus) => <TableRow key={campus.id} hover><TableCell>{campus.name}</TableCell><TableCell>{campus.code}</TableCell><TableCell><Chip label={campus.status} size="small" color={campus.status === 'ACTIVE' ? 'success' : 'default'} /></TableCell>{canManage && <TableCell align="right"><IconButton aria-label={`Edit ${campus.name}`} onClick={() => openEdit(campus)}><IconEdit size={18} /></IconButton></TableCell>}</TableRow>)}</TableBody></Table></TableContainer></Paper>}
    </Box><CampusForm open={dialogOpen} campus={selectedCampus} saving={saving} error={formError} onClose={() => setDialogOpen(false)} onSubmit={(input) => void submit(input)} /></PageContainer>;
}
