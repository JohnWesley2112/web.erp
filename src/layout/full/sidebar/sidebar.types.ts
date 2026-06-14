export interface SidebarMenuItem {
    id: string;
    title: string;
    href?: string;
    icon?: React.ComponentType<any>;
    children?: SidebarMenuItem[];
    subheader?: string;
}