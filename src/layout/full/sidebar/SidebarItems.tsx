import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery, type Theme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { hasPermission } from '../../../utils/permissions';

interface CustomizerState {
    isCollapse: boolean;
    isSidebarHover: boolean;
}

interface RootState {
    customizer: CustomizerState;
}

export interface SidebarItemBase {
    id: string;
    subheader?: string;
    title?: string;
    children?: SidebarItem[];
    href: string;
    icon: any;
}

export interface SidebarSubheaderItem extends Omit<SidebarItemBase, 'id'> {
    id?: string;
    subheader: string;
}

// Export this type!
export interface SidebarCollapseItem extends SidebarItemBase {
    title: string;
    children: Array<SidebarCollapseItem | SidebarNavItem>;
}

// Export this type!
export interface SidebarNavItem extends SidebarItemBase {
    title: string;
}

export type SidebarItem = SidebarSubheaderItem | SidebarCollapseItem | SidebarNavItem;

const SidebarItems = () => {
    const { pathname } = useLocation();
    const pathDirect: string = pathname;
    const pathWithoutLastPart: string = pathname.slice(0, pathname.lastIndexOf('/'));
    const customizer = useSelector((state: RootState) => state.customizer);
    const permissions = useSelector((state: any) => state.permissions.permissions ?? []);
    const lgUp: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const hideMenu: boolean = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : false;
    const dispatch = useDispatch();

    const filterMenu = (items: any[]) => items.reduce((acc: any[], item) => {
        if (item.navlabel) {
            const visibleChildren = item.children ? filterMenu(item.children) : [];
            if (visibleChildren.length > 0) {
                acc.push({ ...item, children: visibleChildren });
            }
            return acc;
        }

        if (item.children) {
            const visibleChildren = filterMenu(item.children);
            if (visibleChildren.length > 0 || hasPermission(permissions, item.requiredPermissions?.[0])) {
                acc.push({ ...item, children: visibleChildren });
            }
            return acc;
        }

        if (hasPermission(permissions, item.requiredPermissions?.[0])) {
            acc.push(item);
        }

        return acc;
    }, []);

    const menuItems = filterMenu(Menuitems as any[]);

    return (
        <Box sx={{ px: 3 }}>
            <List sx={{ pt: 0 }} className="sidebarNav">
                {menuItems.map((item: any) => {
                    if (item.subheader) {
                        return (
                            <NavGroup
                                item={item as SidebarSubheaderItem}
                                hideMenu={hideMenu}
                                key={item.subheader}
                            />
                        );
                    }

                    if (item.children) {
                        return (
                            <NavCollapse
                                menu={item as SidebarCollapseItem}
                                pathDirect={pathDirect}
                                hideMenu={hideMenu}
                                pathWithoutLastPart={pathWithoutLastPart}
                                level={1}
                                key={item.id}
                                onClick={() => dispatch(toggleMobileSidebar())}
                            />
                        );
                    }

                    return (
                        <NavItem
                            item={item as SidebarNavItem}
                            key={item.id}
                            level={1}
                            pathDirect={pathDirect}
                            hideMenu={hideMenu}
                            onClick={() => dispatch(toggleMobileSidebar())}
                        />
                    );
                })}
            </List>
        </Box>
    );
};

export default SidebarItems;