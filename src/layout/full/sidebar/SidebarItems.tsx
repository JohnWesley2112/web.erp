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

interface SidebarItemBase {
  id?: string;
  subheader?: string;
  children?: SidebarItem[];
}

interface SidebarSubheaderItem extends SidebarItemBase {
  subheader: string;
}

interface SidebarCollapseItem extends SidebarItemBase {
  id: string;
  children: SidebarItem[];
}

interface SidebarNavItem extends SidebarItemBase {
  id: string;
}

type SidebarItem = SidebarSubheaderItem | SidebarCollapseItem | SidebarNavItem;

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect: string = pathname;
  const pathWithoutLastPart: string = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: RootState) => state.customizer);
  const lgUp: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const hideMenu: boolean | string = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item: SidebarItem) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                level={1}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
