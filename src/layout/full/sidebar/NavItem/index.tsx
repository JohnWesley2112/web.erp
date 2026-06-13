import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
  type ListItemButtonProps,
} from '@mui/material';

import type { RootState } from '../../../../store/Store';

interface NavItemData {
  id: string | number;
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ElementType;
  external?: boolean;
  disabled?: boolean;
  chip?: string;
  chipColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  variant?: 'filled' | 'outlined';
}

interface NavItemProps {
  item: NavItemData;
  level: number;
  pathDirect: string;
  hideMenu?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const NavItem = ({
  item,
  level,
  pathDirect,
  onClick,
  hideMenu = false,
}: NavItemProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const customizer = useSelector(
    (state: RootState) => state.customizer
  );

  const Icon = item.icon;

  const StyledNavItem = styled(ListItemButton)<ListItemButtonProps>(() => ({
    whiteSpace: 'nowrap',
    marginBottom: 2,
    padding: '8px 10px',
    borderRadius: customizer.borderRadius,

    backgroundColor:
      level > 1 ? 'transparent !important' : 'inherit',

    color:
      level > 1 && pathDirect === item.href
        ? `${theme.palette.primary.main} !important`
        : theme.palette.text.secondary,

    paddingLeft:
      hideMenu
        ? '10px'
        : level > 2
          ? `${level * 15}px`
          : '10px',

    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },

    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,

      '& .MuiListItemIcon-root': {
        color: theme.palette.common.white,
      },
    },
  }));

  const itemIcon =
    level > 1 ? (
      <Icon stroke={1.5} size="1rem" />
    ) : (
      <Icon stroke={1.5} size="1.3rem" />
    );

  const content = (
    <>
      <ListItemIcon
        sx={{
          minWidth: 36,
          py: 0.5,
          color:
            level > 1 && pathDirect === item.href
              ? `${theme.palette.primary.main} !important`
              : 'inherit',
        }}
      >
        {itemIcon}
      </ListItemIcon>

      <ListItemText
        primary={!hideMenu ? t(item.title) : ''}
        secondary={
          item.subtitle && !hideMenu ? (
            <Typography variant="caption">
              {item.subtitle}
            </Typography>
          ) : null
        }
      />

      {!hideMenu && item.chip && (
        <Chip
          label={item.chip}
          size="small"
          color={item.chipColor ?? 'primary'}
          variant={item.variant ?? 'filled'}
        />
      )}
    </>
  );

  return (
    <List component="li" disablePadding>
      {item.external ? (
        <StyledNavItem
          component="a"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          disabled={item.disabled}
          selected={pathDirect === item.href}
          onClick={onClick}
        >
          {content}
        </StyledNavItem>
      ) : (
        <StyledNavItem
          component={NavLink}
          to={item.href}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          onClick={onClick}
        >
          {content}
        </StyledNavItem>
      )}
    </List>
  );
};

export default NavItem;