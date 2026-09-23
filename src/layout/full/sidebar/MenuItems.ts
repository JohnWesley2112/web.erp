import { uniqueId } from 'lodash';
import {
  IconLayoutDashboard,
  IconBuildingSkyscraper,
  IconSchool,
  IconMapPin,
  IconCalendarMonth,
  IconBooks,
  IconUsers,
  IconUserShield,
  IconClipboardCheck,
  IconFileReport,
  IconUserCheck,
  IconFolder,
  IconLock,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Overview',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/home',
    requiredPermissions: [],
  },
  {
    id: uniqueId(),
    title: 'Institution',
    icon: IconBuildingSkyscraper,
    href: '/institution',
    requiredPermissions: ['institution.read'],
  },
  {
    id: uniqueId(),
    title: 'Campuses',
    icon: IconMapPin,
    href: '/campuses',
    requiredPermissions: ['campus.read'],
  },
  {
    navlabel: true,
    subheader: 'Academic',
  },
  {
    id: uniqueId(),
    title: 'Academic',
    icon: IconSchool,
    href: '/academic/years',
    requiredPermissions: ['academic.read'],
    children: [
      { id: uniqueId(), title: 'Academic Years', icon: IconCalendarMonth, href: '/academic/years', requiredPermissions: ['academic.read'] },
      { id: uniqueId(), title: 'Classes', icon: IconFolder, href: '/academic/classes', requiredPermissions: ['academic.read'] },
      { id: uniqueId(), title: 'Sections', icon: IconFolder, href: '/academic/sections', requiredPermissions: ['academic.read'] },
      { id: uniqueId(), title: 'Subjects', icon: IconBooks, href: '/academic/subjects', requiredPermissions: ['academic.read'] },
    ],
  },
  {
    navlabel: true,
    subheader: 'People',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUsers,
    href: '/users',
    requiredPermissions: ['user.manage'],
  },
  {
    id: uniqueId(),
    title: 'Teachers',
    icon: IconUserShield,
    href: '/teachers',
    requiredPermissions: ['teacher.read'],
  },
  {
    id: uniqueId(),
    title: 'Students',
    icon: IconUserCheck,
    href: '/students',
    requiredPermissions: ['student.read'],
  },
  {
    navlabel: true,
    subheader: 'Operations',
  },
  {
    id: uniqueId(),
    title: 'Attendance',
    icon: IconClipboardCheck,
    href: '/attendance',
    requiredPermissions: ['attendance.read'],
  },
  {
    id: uniqueId(),
    title: 'Audit Logs',
    icon: IconFileReport,
    href: '/audit-logs',
    requiredPermissions: ['audit.read'],
  },
  {
    id: uniqueId(),
    title: 'Security',
    icon: IconLock,
    href: '/permissions',
    requiredPermissions: ['user.manage'],
  },
];

export default Menuitems;
