import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons-react';
import { logout } from '../../../../store/auth/AuthSlice';

export const Profile = () => {
  const customizer = useSelector((state: any) => state.customizer);
  const user = useSelector((state: any) => state.auth.user);
  const tenantName = useSelector((state: any) => state.auth.tenantName) ?? localStorage.getItem('activeTenantName') ?? 'Current institution';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        m: 3, p: 2, bgcolor: 'secondary.light', display: 'flex',
        alignItems: 'center', gap: 2
      }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="User avatar" src={img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">
              {user?.firstName || 'User'} {user?.lastName || ''}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {tenantName}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" aria-label="logout" size="small" onClick={handleLogout}>
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
