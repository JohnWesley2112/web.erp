import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router";


function AuthSignup() {
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState<Boolean>(false)
    const toggleVisibility = () => setIsPasswordVisible(e => !e)
    const goToLogin = () => navigate('/login')
    return (
        <Box>
            <Stack spacing={2}>
                <TextField label="Username" type="text" fullWidth />
                <TextField
                    label="Password"
                    type={isPasswordVisible ? "password" : "text"}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="" onClick={toggleVisibility}>
                                        {isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    fullWidth
                />
                <Stack direction={'row'} spacing={1} sx={{
                    pt: 2
                }}>
                    <Button onClick={goToLogin} fullWidth color="error" variant="outlined">Go to Login</Button>
                    <Button fullWidth variant="contained">Login</Button>
                </Stack>
            </Stack>
        </Box>
    )
}

export default AuthSignup