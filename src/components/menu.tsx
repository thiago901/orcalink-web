import { useDisclosure } from '@heroui/modal';
import { Button } from '@heroui/button';
import { FaOpensuse } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Link } from '@heroui/link';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Building2, ClipboardList, Home, User } from 'lucide-react';


export const Menu = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();
    // const { user, logout } = useAuthStore();
    const navItems = [
        { href: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { href: '/dashboard/profile', icon: <User size={20} />, label: 'Perfil' },
        { href: '/dashboard/estimate-requests', icon: <ClipboardList size={20} />, label: 'Orçamentos' },
        { href: '/dashboard/companies', icon: <Building2 size={20} />, label: 'Empresas' },
      ];
    const footerItems = [
        {
            label: 'Voltar pagina inicial',
            icon: MdOutlineKeyboardBackspace,
            href: '/',
        },
    ];

    const toggleMenu = () => {
        if (isOpen) {
            onClose();
            // switchSideBar(false);
        } else {
            onOpen();
            // switchSideBar(true);
        }
    };

    // useEffect(() => {
    //     if (config.is_sidebar_open) {
    //         onOpen();
    //     } else {
    //         onClose();
    //     }
    // }, []);

    return (
        <aside
            className={`h-screen transition-all duration-300 ease-in-out flex flex-col items-center py-4 shadow-sm ${isOpen ? 'w-56' : 'w-16'}`}
        >
            {/* Botão de toggle */}
            <div className="w-full flex justify-center px-2">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={toggleMenu}
                >
                    <FaOpensuse size={20} />
                </Button>
            </div>

            {/* Navegação */}
            <nav className="mt-8 flex flex-col gap-2 w-full px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                            )}
                            href={item.href}
                        >
                            <span className="min-w-[24px] flex justify-center">
                                {item.icon}
                            </span>
                            <span
                                className={clsx(
                                    'text-sm whitespace-nowrap transition-opacity duration-200',
                                    isOpen
                                        ? 'opacity-100 delay-100 ml-1'
                                        : 'opacity-0 w-0 overflow-hidden',
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
                {footerItems.map((item) => {
                    return (
                        <Link
                            key={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                                'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                            )}
                            href={item.href}
                        >
                            <span className="min-w-[24px] flex justify-center">
                                <item.icon size={20} />
                            </span>
                            <span
                                className={clsx(
                                    'text-sm whitespace-nowrap transition-opacity duration-200',
                                    isOpen
                                        ? 'opacity-100 delay-100 ml-1'
                                        : 'opacity-0 w-0 overflow-hidden',
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Rodapé */}
            <div className="mt-auto mb-4">
                {/* <ThemeSwitch /> */}
            </div>
        </aside>
    );
};
