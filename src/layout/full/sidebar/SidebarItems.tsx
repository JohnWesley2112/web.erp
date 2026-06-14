import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery, type Theme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from '../../../store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';

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
    const lgUp: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    // Fall back to a structural boolean 'false' instead of a empty string ''
    const hideMenu: boolean = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : false;
    const dispatch = useDispatch();

    return (
        <Box sx={{ px: 3 }}>
            <List sx={{ pt: 0 }} className="sidebarNav">
                {Menuitems.map((item: any) => {
                    // SubHeader
                    if (item.subheader) {
                        return (
                            <NavGroup
                                item={item as SidebarSubheaderItem}
                                hideMenu={hideMenu}
                                key={item.subheader}
                            />
                        );
                    }

                    // If Sub Menu (Now outside the comment block trap)
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

                    // If Sub No Menu
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