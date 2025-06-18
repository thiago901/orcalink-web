import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useCallback, useEffect } from "react";
import { useThemeStore } from "../../stores/themeStore";

import { getCompaniesByOwnerId } from "../../api/companies";
import { useQuery } from "@tanstack/react-query";
import { CiSun } from "react-icons/ci";
import { FiMoon } from "react-icons/fi";

import { Notification } from "../notification";

const navbarItems = [
  { label: "Inicial", href: "/" },
  { label: "Meus orçamentos", href: "/my-budgets" },
  { label: "Parceiros", href: "/partners" },
  { label: "Para Empresas", href: "/plans" },
];
export const UserLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const { data: companies } = useQuery({
    queryKey: ["companies", user?.id],
    queryFn: () => getCompaniesByOwnerId(user?.id || ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );
  function shouldHide(url:string){
    const rules ={
      "/my-budgets": url === "/my-budgets" && !isAuthenticated,
      "/plans": url === "/plans" &&isAuthenticated&& user?.role==='customer'
    }

    return rules[url as keyof typeof rules] || false
  }

  return (
    <div>
      <header>
        <Navbar>
          <NavbarBrand>
            <div className="flex items-center justify-between h-16  flex-shrink-0 min-w-0 ">
              <Link href="/" className="flex items-center">
                <Image src="./favicon.png" className="w-10 h-10" />
                <h1 className="text-xl font-bold">OrçaLink</h1>
              </Link>
            </div>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {navbarItems.map((item, index) => (
              <NavbarItem
                key={index}
                isActive={isActive(item.href)}
                hidden={shouldHide(item.href)}
              >
                <Link
                  color={isActive(item.href) ? "primary" : "foreground"}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          {isAuthenticated ? (
            <>
              <NavbarContent as="div" justify="end">
                <Notification />
              </NavbarContent>
              <NavbarContent as="div" justify="end">
                <Button onPress={toggleTheme} isIconOnly={true} variant="light">
                  {theme === "dark" ? (
                    <CiSun size={20} />
                  ) : (
                    <FiMoon size={20} />
                  )}
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      color="secondary"
                      name={user?.name.toLocaleUpperCase()}
                      size="sm"
                      src={user?.avatar}
                      showFallback
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">Logado como:</p>
                      <p className="font-semibold">{user?.email}</p>
                    </DropdownItem>
                    <DropdownItem key="settings" href="/profile">Perfil</DropdownItem>
                    <DropdownItem key="bugets" href="my-budgets">
                      Meus orçamentos
                    </DropdownItem>
                    <DropdownItem key="partners" href="/partners">
                      Parceiros
                    </DropdownItem>
                    {!!companies &&
                    user?.role === "company" &&
                    companies?.length > 0 ? (
                      <DropdownItem key="my-companies" href="/company">
                        Acessar dashboard
                      </DropdownItem>
                    ) : user?.role === "company" ? (
                      <DropdownItem
                        key="my-companies"
                        href="/company/profile/new"
                      >
                        Criar empresa
                      </DropdownItem>
                    ) : (
                      <></>
                    )}

                    <DropdownItem
                      key="logout"
                      color="danger"
                      onPress={handleLogout}
                    >
                      Sair
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarContent>
            </>
          ) : (
            <NavbarContent justify="end">
              <Button onPress={toggleTheme} isIconOnly={true} variant="light">
                {theme === "dark" ? <CiSun size={20} /> : <FiMoon size={20} />}
              </Button>
              <NavbarItem className="lg:flex">
                <Link href="/login">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  color="primary"
                  href="/register"
                  variant="flat"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </NavbarContent>
          )}
        </Navbar>
      </header>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};
