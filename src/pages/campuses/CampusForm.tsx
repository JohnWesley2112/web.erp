import { useEffect, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import type { Campus, CampusInput } from "../../api/helpers/campus-api/campus-api.helper";

interface CampusFormProps { open: boolean; campus?: Campus | null; saving: boolean; error: string | null; onClose: () => void; onSubmit: (input: CampusInput) => void; }
const blank: CampusInput = { name: "", code: "", address: "", status: "ACTIVE" };

export default function CampusForm({ open, campus, saving, error, onClose, onSubmit }: CampusFormProps) {
    const [form, setForm] = useState<CampusInput>(blank);
    const [validationError, setValidationError] = useState<string | null>(null);
    useEffect(() => { setForm(campus ? { name: campus.name, code: campus.code, address: campus.address ?? "", status: campus.status } : blank); setValidationError(null); }, [campus, open]);
    const submit = () => { if (!form.name.trim() || !form.code.trim()) { setValidationError("Campus name and code are required."); return; } onSubmit({ ...form, name: form.name.trim(), code: form.code.trim().toUpperCase() }); };
    return <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="sm"><DialogTitle>{campus ? 'Edit Campus' : 'Add Campus'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
        {(validationError || error) && <Alert severity="error">{validationError ?? error}</Alert>}
        <TextField label="Campus name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} slotProps={{ htmlInput: { maxLength: 200 } }} autoFocus />
        <TextField label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} slotProps={{ htmlInput: { maxLength: 100 } }} />
        <TextField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} multiline minRows={3} slotProps={{ htmlInput: { maxLength: 2000 } }} />
        <TextField select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CampusInput['status'] })}><MenuItem value="ACTIVE">Active</MenuItem><MenuItem value="INACTIVE">Inactive</MenuItem></TextField>
    </Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={saving}>Cancel</Button><Button variant="contained" onClick={submit} disabled={saving}>{saving ? 'Saving…' : campus ? 'Save changes' : 'Add Campus'}</Button></DialogActions></Dialog>;
}
