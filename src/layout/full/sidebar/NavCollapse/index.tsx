// E:\erp\web.erp\src\layout\full\sidebar\NavCollapse\index.tsx 
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

// MUI imports
import { ListItemIcon, ListItem, Collapse, styled, ListItemText } from '@mui/material';

// Custom imports
import NavItem from '../NavItem';

// Plugins
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// FIX: Import the exact shared interfaces from your SidebarItems component
import type { SidebarCollapseItem } from '../SidebarItems';

interface NavCollapseProps {
    menu: SidebarCollapseItem; 
    level: number;
    pathWithoutLastPart: string;
    pathDirect: string;
    hideMenu: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

interface CustomizerState {
    customizer: {
        borderRadius: number;
    };
}

// Transient props interface using '$' for Emotion / MUI v9
interface ListItemStyledProps {
    $open: boolean;
    $level: number;
    $hideMenu: boolean;
    $borderRadius: number;
    $pathname: string;
    $menuHref: string;
}

// Styled Component outside to maintain performance and avoid recreation on render
const ListItemStyled = styled(ListItem)<ListItemStyledProps>(({
    theme,
    $open,
    $level,
    $hideMenu,
    $borderRadius,
    $pathname,
    $menuHref
}) => ({
    marginBottom: '2px',
    cursor: 'pointer',
    padding: '8px 10px',
    paddingLeft: $hideMenu ? '10px' : $level > 2 ? `${$level * 15}px` : '10px',
    backgroundColor: $open && $level < 2 ? theme.palette.primary.main : '',
    whiteSpace: 'nowrap',
    borderRadius: `${$borderRadius}px`,
    '&:hover': {
        backgroundColor:
            $pathname.includes($menuHref) || $open
                ? theme.palette.primary.main
                : theme.palette.primary.light,
        color: $pathname.includes($menuHref) || $open ? 'white' : theme.palette.primary.main,
    },
    color:
        $open && $level < 2
            ? 'white'
            : $level > 1 && $open
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
}));

const NavCollapse: React.FC<NavCollapseProps> = ({
    menu,
    level,
    pathWithoutLastPart,
    pathDirect,
    onClick,
    hideMenu,
}) => {
    const customizer = useSelector((state: CustomizerState) => state.customizer);
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    const Icon = menu.icon as React.ComponentType<any>; 
    const menuIcon = level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

    const handleClick = () => {
        setOpen(!open);
    };

    // Auto-expand menu collapse if a child route matches pathname
    useEffect(() => {
        let isChildActive = false;
        menu.children?.forEach((item: any) => {
            if (item.href === pathname) {
                isChildActive = true;
            }
        });
        if (isChildActive) {
            setOpen(true);
        }
    }, [pathname, menu.children]);

    // Generate Submenus safely
    const submenus = menu.children?.map((item: any) => {
        if (item.children) {
            return (
                <NavCollapse
                    key={item.id}
                    menu={item}
                    level={level + 1}
                    pathWithoutLastPart={pathWithoutLastPart}
                    pathDirect={pathDirect}
                    hideMenu={hideMenu}
                    onClick={onClick}
                />
            );
        } else {
            return (
                <NavItem
                    key={item.id}
                    item={item}
                    level={level + 1}
                    pathDirect={pathDirect}
                    hideMenu={hideMenu}
                    onClick={onClick}
                />
            );
        }
    });

    return (
        <React.Fragment>
            <ListItemStyled
                onClick={handleClick}
                $open={open}
                $level={level}
                $hideMenu={hideMenu}
                $borderRadius={customizer.borderRadius}
                $pathname={pathname}
                $menuHref={menu.href || ''} 
                className={pathWithoutLastPart === menu.href ? 'Mui-selected' : ''}
            >
                <ListItemIcon
                    sx={{
                        minWidth: '36px',
                        p: '3px 0',
                        color: 'inherit',
                    }}
                >
                    {menuIcon}
                </ListItemIcon>

                <ListItemText sx={{ color: 'inherit', my: 0 }}>
                    {hideMenu ? '' : <>{t(`${menu.title}`)}</>}
                </ListItemText>

                {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
            </ListItemStyled>

            <Collapse in={open} timeout="auto" unmountOnExit>
                {submenus}
            </Collapse>
        </React.Fragment>
    );
};

export default NavCollapse;