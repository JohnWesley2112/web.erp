import { useState } from 'react';
import { Link } from 'react-router';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/auth/AuthSlice';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import unlimitedImg from 'src/assets/images/backgrounds/unlimited-bg.png';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const user = useSelector((state: any) => state.auth.user);
  const tenantName = useSelector((state: any) => state.auth.tenantName) ?? localStorage.getItem('activeTenantName') ?? 'Current institution';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose2();
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show user profile"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={user?.firstName || 'User'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">User Profile</Typography>
            <Stack sx={{ direction: 'row', py: 3, spacing: 2, alignItems: 'center' }}>
              <Avatar src={ProfileImg} alt={user?.firstName || 'User'} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" sx={{ fontWeight: 600 }}>
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {tenantName}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <IconMail width={15} height={15} />
                  {user?.email || 'user@erp.local'}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Box sx={{ mt: 2 }}>
              <Box sx={{ bgcolor: 'primary.light', p: 3, mb: 3, overflow: 'hidden', position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ variant: 'h5', mb: 2 }}>
                      Active <br />
                      Institution
                    </Typography>
                    <Button variant="contained" color="primary" component={Link} to="/institution">
                      View
                    </Button>
                  </Box>
                  <img src={unlimitedImg} alt="institution" className="signup-bg"></img>
                </Box>
              </Box>
              <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
