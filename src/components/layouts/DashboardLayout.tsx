import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "../../stores/themeStore";

import { Avatar, Button, Card, Divider, Image, Link, Listbox, ListboxItem } from "@heroui/react";
import { Text } from "../ui/Text";

import { FiArrowLeft, FiMenu, FiMoon } from "react-icons/fi";
import { CiHome, CiLogout, CiSun } from "react-icons/ci";
import { FaBuilding, FaX } from "react-icons/fa6";

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { to: "/dashboard", icon: <CiHome size={20} />, label: "Dashboard" },
    
  
    {
      to: "/dashboard/companies",
      icon: <FaBuilding size={20} />,
      label: "Empresas",
    },
  ];

  
  return (
    <div className="flex h-screen overflow-hidden ">
    
      {/* Sidebar */}
      <Card
        as={"aside"}
        radius="none"
        className={`fixed top-0 left-0 z-20 flex flex-col w-64 h-screen transition-transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-0 `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4">
            <Image src="./favicon.png"  className="w-10 h-10"/>
            <h1 className="text-xl font-bold">
              OrçaFacil
            </h1>
            <Button
              className="lg:hidden"
              onPress={toggleSidebar}
              radius="sm"
              isIconOnly
              variant="bordered"
            >
              <FaX size={24}  />
            </Button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-4 ">
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={user?.name.toLocaleUpperCase()}
              size="lg"
              src={user?.avatar}
              showFallback
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-xs truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 ">
            <Listbox className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
              startContent={<FiArrowLeft  size={20} /> }
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
              startContent={theme === "dark" ? <CiSun size={20} /> : <FiMoon size={20} />}
              variant="light"
              isIconOnly
            />
          </div>
        </div>
      </Card>
      <Divider orientation="vertical"/>
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-4 lg:hidden">
          <Button className="lg:hidden" onPress={toggleSidebar} isIconOnly variant="bordered" radius="sm">
            <FiMenu
              size={24}
              
            />
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
    </div>
  );
};

export default DashboardLayout;
