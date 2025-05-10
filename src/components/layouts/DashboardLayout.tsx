import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  Home, 
  User, 
  Building2, 
  ClipboardList, 
  FileText, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/dashboard/profile', icon: <User size={20} />, label: 'Perfil' },
    { to: '/dashboard/estimate-requests', icon: <ClipboardList size={20} />, label: 'Orçamentos' },
    { to: '/dashboard/companies', icon: <Building2 size={20} />, label: 'Empresas' },
    { to: '/dashboard/proposals', icon: <FileText size={20} />, label: 'Propostas' },
  ];

  const NavItem = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 font-medium'
            : 'text-neutral-600 hover:bg-neutral-100'
        }`
      }
      onClick={() => setIsSidebarOpen(false)}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 flex flex-col w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0 bg-white border-r border-neutral-200`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-primary-700">OrçaFacil</h1>
          <button 
            className="p-1 rounded-md lg:hidden" 
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-200">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-2 text-neutral-600 transition-colors rounded-md hover:bg-neutral-100"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-neutral-200">
          <button 
            className="p-2 rounded-md lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="lg:hidden flex-1 text-center font-bold text-primary-700">
            OrçaFacil
          </div>
          <div className="hidden lg:block"></div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;