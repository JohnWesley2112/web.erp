import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { IconEdit } from "@tabler/icons-react";
import PageContainer from "../../components/container/PageContainer";
import { institutionApi, type Institution, type UpdateInstitutionInput } from "../../api/helpers/institution-api/institution-api.helper";
import { useAppSelector } from "../../store/Hooks";
import { hasPermission } from "../../utils/permissions";

const messageFor = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const data = (error as { response?: { data?: { error?: { message?: string }; message?: string } } }).response?.data;
        return data?.error?.message ?? data?.message ?? fallback;
    }
    return fallback;
};

const toInput = (institution: Institution): UpdateInstitutionInput => ({
    name: institution.name,
    email: institution.email ?? "",
    phone: institution.phone ?? "",
    address: institution.address ?? "",
});

export default function InstitutionPage() {
    const permissions = useAppSelector((state) => state.permissions.permissions);
    const canManage = hasPermission(permissions, "institution.manage");
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<UpdateInstitutionInput | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadInstitution = useCallback(async () => {
        setLoading(true); setError(null);
        try { setInstitution(await institutionApi.getInstitution()); }
        catch (err) { setError(messageFor(err, "Unable to load institution information.")); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { void loadInstitution(); }, [loadInstitution]);

    const openEdit = () => {
        if (institution) { setForm(toInput(institution)); setFormError(null); setDialogOpen(true); }
    };
    const save = async () => {
        if (!form) return;
        if (!form.name.trim()) { setFormError("Institution name is required."); return; }
        setSaving(true); setFormError(null);
        try {
            setInstitution(await institutionApi.updateInstitution(form));
            setDialogOpen(false); setSuccess("Institution information updated successfully.");
        } catch (err) { setFormError(messageFor(err, "Unable to update institution information.")); }
        finally { setSaving(false); }
    };

    return <PageContainer title="Institution" description="Institution profile">
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
                <Box><Typography variant="h4">Institution</Typography><Typography color="text.secondary">Current tenant profile</Typography></Box>
                {canManage && <Button variant="contained" startIcon={<IconEdit size={18} />} onClick={openEdit} disabled={!institution}>Edit Institution</Button>}
            </Box>
            {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}
            {loading ? <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box> : error ? <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void loadInstitution()}>Retry</Button>}>{error}</Alert> : institution &&
                <Paper sx={{ p: 3 }}><Grid container spacing={3}>
                    {[['Name', institution.name], ['Code', institution.code], ['Email', institution.email], ['Phone', institution.phone], ['Address', institution.address]].map(([label, value]) =>
                        <Grid key={label} size={{ xs: 12, sm: label === 'Address' ? 12 : 6 }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography>{value || '—'}</Typography></Grid>
                    )}
                </Grid></Paper>}
        </Box>
        <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Edit Institution</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
                {formError && <Alert severity="error">{formError}</Alert>}
                {form && <>{([['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address']] as const).map(([key, label]) => <TextField key={key} label={label} required={key === 'name'} type={key === 'email' ? 'email' : 'text'} multiline={key === 'address'} minRows={key === 'address' ? 3 : undefined} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} slotProps={{ htmlInput: { maxLength: key === 'address' ? 2000 : key === 'email' ? 255 : key === 'phone' ? 50 : 200 } }} />)}</>}
            </Stack></DialogContent>
            <DialogActions><Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button><Button variant="contained" onClick={() => void save()} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button></DialogActions>
        </Dialog>
    </PageContainer>;
}
