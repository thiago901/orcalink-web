import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";

import {
  PiBriefcaseThin,
  PiBuildingThin,
  PiFileTextThin,
  PiHouseLineThin,
  PiListChecksThin,
  PiPlusCircle,
} from "react-icons/pi";

import {
  Button,
  Card,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Listbox,
  ListboxItem,
  User,
} from "@heroui/react";
import { Text } from "../ui/Text";
import { IoIosArrowDown } from "react-icons/io";

import { FiArrowLeft, FiMenu, FiMoon } from "react-icons/fi";
import { CiLogout, CiSun } from "react-icons/ci";
import { FaX } from "react-icons/fa6";
import { useCompanyStore } from "../../stores/companyStore";


const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const { getCompanies, setCompany, companies, current_company, resetCompany } =
    useCompanyStore();

  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    async function load() {
      if (user) {
        if (user.role === "customer") {
          navigate("/");
        }
        await getCompanies(user.id);
      }
    }
    load();
  }, [user, getCompanies, navigate]);

  const handleLogout = () => {
    logout();
    resetCompany();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { to: "/company", icon: <PiHouseLineThin size={20} />, label: "Dashboard" },

    {
      to: "/company/profile",
      icon: <PiBuildingThin size={20} />,
      label: "Empresa",
    },
    {
      to: "/company/budgets",
      icon: <PiFileTextThin size={20} />,
      label: "Orçamentos",
    },
    {
      to: "/company/proposals",
      icon: <PiListChecksThin size={20} />,
      label: "Propostas",
    },
    {
      to: "/company/jobs",
      icon: <PiBriefcaseThin size={20} />,
      label: "Trabalhos",
    },
  ];

  function MainContent() {
    return (
      <>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top header */}
          <header className="flex items-center justify-between h-16 px-4 lg:hidden">
            <Button
              className="lg:hidden"
              onPress={toggleSidebar}
              isIconOnly
              variant="bordered"
              radius="sm"
            >
              <FiMenu size={24} />
            </Button>
            <div className="lg:hidden flex-1 text-center font-bold text-primary-700 ">
              OrçaFacil
            </div>
            <div className="hidden lg:block"></div>
          </header>

          {/* Page content */}
          <main className="flex-1 flex overflow-y-auto">
            <Card radius="none" className="p-4 overflow-y-auto flex-1">
              <Outlet />
            </Card>
          </main>
        </div>
      </>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar */}

      {!current_company.id ? (
        <MainContent />
      ) : (
        <>
          <Card
            as={"aside"}
            radius="none"
            className={`fixed top-0 left-0 z-20 flex flex-col w-64 h-screen transition-transform  ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:static lg:z-0 `}
          >
            <div className="flex flex-col h-full">
              <Button
                className="lg:hidden"
                onPress={toggleSidebar}
                radius="sm"
                isIconOnly
                variant="bordered"
              >
                <FaX size={24} />
              </Button>

              {/* User info */}
              <div className="p-4 ">
                <Text type="small" color="muted" className="mb-2">
                  Selecione a empresa:{" "}
                </Text>

                <Dropdown placement="bottom-start">
                  <DropdownTrigger>
                    <div className="flex items-center gap-2">
                      <User
                        as="button"
                        avatarProps={{
                          isBordered: true,
                          src: current_company?.avatar,
                          name: current_company?.name.toLocaleUpperCase(),
                          color: "secondary",
                          size: "md",
                          icon: <IoIosArrowDown />,
                        }}
                        className="transition-transform"
                        description={current_company?.email}
                        name={current_company?.name}
                      />
                      <IoIosArrowDown />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="User Actions"
                    variant="flat"
                    disabledKeys={[current_company.id]}
                  >
                    <>
                      {companies.map((item, index) => (
                        <DropdownItem
                          key={item.id}
                          className="h-14 gap-2"
                          onPress={() => setCompany(item)}
                          showDivider={index === companies.length - 1}
                        >
                          <div className="flex items-center gap-2">
                            <User
                              as="button"
                              avatarProps={{
                                isBordered: true,
                                src: item.avatar,
                                name: item?.name.toLocaleUpperCase(),
                              }}
                              className="transition-transform"
                              description={item.email}
                              name={item.name}
                            />
                            {item.id === current_company.id && (
                              <Chip color="primary" size="sm">
                                Atual
                              </Chip>
                            )}
                          </div>
                        </DropdownItem>
                      ))}
                      <DropdownItem
                        key="new"
                        className="mt-2"
                        color="primary"
                        href="company/profile/new"
                      >
                        <div className="flex gap-2 justify-center">
                          <PiPlusCircle size={20} />
                          Nova Empresa
                        </div>
                      </DropdownItem>
                    </>
                  </DropdownMenu>
                </Dropdown>
              </div>

              {/* Navigation */}
              <div className="flex-1 ">
                <Listbox className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <ListboxItem
                      key={item.to}
                      startContent={item.icon}
                      href={item.to}
                      color="primary"
                    >
                      <Text>{item.label}</Text>
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>

              {/* Theme toggle and logout */}
              <div className="p-4 space-y-2">
                <Button
                  as={Link}
                  className="w-full"
                  startContent={<FiArrowLeft size={20} />}
                  variant="flat"
                  href="/"
                >
                  Voltar para o início
                </Button>
                <Button
                  onPress={handleLogout}
                  className="w-full"
                  startContent={<CiLogout size={20} />}
                  color="danger"
                  variant="bordered"
                >
                  Sair
                </Button>
                <Button
                  onPress={toggleTheme}
                  className="w-full"
                  startContent={
                    theme === "dark" ? (
                      <CiSun size={20} />
                    ) : (
                      <FiMoon size={20} />
                    )
                  }
                  variant="light"
                  isIconOnly
                />
              </div>
            </div>
          </Card>
          <Divider orientation="vertical" />
          {/* Main content */}
          <MainContent/>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
