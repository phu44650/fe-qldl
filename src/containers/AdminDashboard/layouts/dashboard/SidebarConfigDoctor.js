// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfigDoctor = [
  {
    title: "Manage Doctor's patient",
    path: "/admin-dashboard/doctor/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
  {
    title: "Manage Doctor's schedule",
    path: "/admin-dashboard/doctor/manage-schedule-doctor",
    icon: getIcon("healthicons:i-schedule-school-date-time"),
  },
  {
    title: "Manage Doctor's histories",
    path: "/admin-dashboard/doctor/history",
    icon: getIcon("fluent:patient-32-regular"),
  },
  {
    title: "Account",
    path: "/admin-dashboard/doctor/account",
    icon: getIcon("eva:people-fill"),
  },
];

export default sidebarConfigDoctor;
