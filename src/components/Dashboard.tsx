"use client";
import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SVGProps,
  useEffect,
  useState,
} from "react";
import { Menu, MenuButton } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  PhoneArrowUpRightIcon,
  PlusIcon,
  MinusIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import Searchinput from "./Searchinput";
import Image from "next/image";

type NavigationItem = {
  name: string;
  href?: string;
  current: boolean;
  icon?: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  subItems?: { name: string; href: string; current?: boolean }[];
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  {
    name: "School",
    href: "#",
    current: false,
    icon: LightBulbIcon,
    subItems: [
      { name: "School", href: "/school/school", current: false },
      { name: "Branch", href: "/school/branch", current: false },
    ],
  },
  {
    name: "Student",
    href: "#",
    current: false,
    icon: AcademicCapIcon,
    subItems: [
      { name: "All Students", href: "/student/all-student", current: false },
      { name: "Add New Students", href: "/student/new-student", current: false },
      { name: "Trial Students", href: "/student/trial-student", current: false },
    ],
  },
  {
    name: "Teacher",
    href: "#",
    current: false,
    icon: BookOpenIcon,
    subItems: [
      { name: "All Teachers", href: "/teacher/all-teacher", current: false },
      { name: "New Teachers", href: "/teacher/new-teacher", current: false },
    ],
  },
  {
    name: "Program",
    href: "#",
    current: false,
    icon: ClipboardDocumentListIcon,
    subItems: [
      { name: "All Programs", href: "/program/all-program", current: false },
      { name: "New Programs", href: "/program/new-program", current: false },
    ],
  },
  {
    name: "Class",
    href: "#",
    current: false,
    icon: BuildingLibraryIcon,
    subItems: [
      { name: "All Classes", href: "/class/all-class", current: false },
      { name: "New Class", href: "/class/new-class", current: false },
    ],
  },
  {
    name: "Attendance",
    href: "#",
    current: false,
    icon: CheckBadgeIcon,
    subItems: [
      { name: "Student Attendance", href: "/attendance/student", current: false },
      { name: "Teacher Attendance", href: "/attendance/teacher", current: false },
    ],
  },

  {
    name: "Setting",
    href: "#",
    current: false,
    icon: Cog6ToothIcon,
    subItems: [
      { name: "Account Setting", href: "/setting/account-setting", current: false },
      { name: "Logout", href: "/login", current: false },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DashboardProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [navigationData, setNavigationData] = useState(navigation);
  const userName = "John Doe";
  const userUrl = "/photo.jpg";

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleToggle = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const handleClick = (name: string, subItemName?: string) => {
    const updatedNavigation = navigationData.map((item) => {
      const isCurrentParent = item.name === name;
      const isCurrentSubItem = item.subItems?.some(
        (subItem) => subItem.name === subItemName
      );

      if (isCurrentParent || isCurrentSubItem) {
        return {
          ...item,
          current: true,
          subItems: item.subItems?.map((subItem) => ({
            ...subItem,
            current: subItem.name === subItemName,
          })),
        };
      }
      return {
        ...item,
        current: false,
        subItems: item.subItems?.map((subItem) => ({
          ...subItem,
          current: false,
        })),
      };
    });

    setNavigationData(updatedNavigation);
    if (!subItemName) handleToggle(name);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;

    const updatedNavigation = navigation.map((item) => {
      const isParentCurrent = !!(item.href && currentPath.startsWith(item.href));
      const subItemCurrent =
        item.subItems?.some((subItem) =>
          currentPath.startsWith(subItem.href)
        ) || false;

      if (subItemCurrent) {
        setOpenMenu(item.name);
      }

      return {
        ...item,
        current: isParentCurrent || subItemCurrent,
        subItems:
          item.subItems?.map((subItem) => ({
            ...subItem,
            current: currentPath.startsWith(subItem.href),
          })) || [],
      };
    });

    setNavigationData(updatedNavigation);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-transform transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 lg:top-[62px] top-[59px] w-[232px] bg-[#213458] z-40 lg:block`}
      >
        <div className="flex flex-col gap-y-5 overflow-y-auto px-6 pb-4 mt-3">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-5">
                  {navigationData.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={() => {
                          handleClick(item.name);
                          handleToggle(item.name);
                        }}
                        className={classNames(
                          item.current
                            ? "text-white"
                            : "text-indigo-200 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer"
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-indigo-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                        )}
                        {item.name}
                        {item.subItems && item.name !== "Dashboard" && (
                          <span className="ml-auto">
                            {openMenu === item.name ? (
                              <MinusIcon className="h-5 w-5 text-white" />
                            ) : (
                              <PlusIcon className="h-5 w-5 text-white" />
                            )}
                          </span>
                        )}
                      </a>
                      {openMenu === item.name && item.subItems && (
                        <ul className="mt-2 space-y-2 pl-8">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                onClick={() =>
                                  handleClick(item.name, subItem.name)
                                }
                                className={classNames(
                                  subItem.current
                                    ? "text-white"
                                    : "text-indigo-200 hover:text-white",
                                  "text-sm font-semibold leading-6"
                                )}
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-grow transition-all duration-300 ease-in-out ml-0">
        <div className="bg-[#213458] lg:w-full lg:h-16 w-[390px] h-[59px] fixed top-0 z-30">
          <div className="flex items-center h-16 justify-between px-4 shadow-sm">
            <div className="flex items-center m-0 lg:ml-12 lg:gap-16">
              <Image
                alt="Your Company"
                src="/AAA logo.png"
                width={80}
                height={80}
                className="w-[61px] h-[54px lg:w-[80px] lg:h-[80px]]"
              />
              <Searchinput />
              {/* Hamburger button to open sidebar */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="text-gray-200 lg:ml-3 mr-16 flex-1 flex justify-end lg:absolute lg:left-[202px] lg:top-5"
              >
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-1 justify-center items-center gap-x-4 mr-[30px]">
              <div className="ml-[320px] flex-row flex lg:items-end gap-4">
                <div aria-hidden="true" className="h-6 w-px ml-2 bg-gray-200" />
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center">
                    <span className="sr-only">Open user menu</span>
                    <h1 className="text-white mr-3">{userName}</h1>
                    <Image
                      alt={userName}
                      src={userUrl}
                      className="h-8 w-8 rounded-full bg-gray-800"
                      width={20}
                      height={20}
                    />
                  </MenuButton>
                </Menu>
              </div>
            </div>
          </div>
        </div>
        <main className="flex lg:px-12 px-8 h-full overflow-auto bg-[#F0F4FA] flex-col flex-grow">
          <div
            className={`transition-all duration-300 ease-in-out ${
              sidebarOpen
                ? "opacity-100 transform translate-x-0"
                : "opacity-1000 transform translate-x-[-10%]"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
