// src/pages/auth/authform/AuthLogin.tsx
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { login } from "../../../store/auth/AuthSlice";
import { loadPermissions } from "../../../store/permissions/PermissionSlice";

interface LoginFormState {
    email: string;
    password: string;
}

function AuthLogin() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const [formData, setFormData] = useState<LoginFormState>({
        email: "",
        password: "",
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toggleVisibility = () => setIsPasswordVisible((value) => !value);
    const goToSignup = () => navigate("/signup");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const resultAction = await dispatch(
                login({
                    email: formData.email,
                    password: formData.password,
                }),
            );

            if (login.fulfilled.match(resultAction)) {
                dispatch(loadPermissions());
                navigate("/home");
            } else {
                setError(String(resultAction.payload || "Invalid email or password"));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "Invalid email or password");
                return;
            }

            setError("Invalid email or password");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                {error && (
                    <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
                        {error}
                    </Box>
                )}

                <TextField
                    onChange={handleChange}
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    fullWidth
                    required
                />
                <TextField
                    onChange={handleChange}
                    label="Password"
                    name="password"
                    value={formData.password}
                    type={isPasswordVisible ? "text" : "password"}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={toggleVisibility}>
                                        {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    fullWidth
                    required
                />
                <Stack direction={"row"} spacing={1} sx={{ pt: 2 }}>
                    <Button onClick={goToSignup} fullWidth color="error" variant="outlined">
                        Signup
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default AuthLogin;
