import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  BookOpen,
  FolderKanban,
  Award,
  MessageSquare,
  Package,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const sidebarItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Website Settings', to: '/admin/settings', icon: Settings },
  { label: 'Hero Slideshow', to: '/admin/hero', icon: ImageIcon },
  { label: 'Blogs CMS', to: '/admin/blogs', icon: BookOpen },
  { label: 'Gallery & Albums', to: '/admin/gallery', icon: FolderKanban },
  { label: 'Services & Packages', to: '/admin/services', icon: Package },
  { label: 'Awards & Reviews', to: '/admin/testimonials', icon: Award },
  { label: 'SEO Metadata', to: '/admin/seo', icon: Globe },
  { label: 'FAQs Manager', to: '/admin/faqs', icon: HelpCircle },
  { label: 'Enquiries', to: '/admin/enquiries', icon: MessageSquare },
  { label: 'Cloudinary Media', to: '/admin/media', icon: ImageIcon },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('cms_admin_token');
    navigate('/admin/login');
  };

  const adminEmail = localStorage.getItem('cms_admin_email') || 'admin@brothersphotographyj.com';

  return (
    <div className={cn('min-h-screen font-sans', darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-zinc-900')}>
      {/* Mobile Top Navbar */}
      <header className={cn('flex items-center justify-between border-b px-6 py-4 md:hidden', darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white')}>
        <Link to="/admin" className="font-serif text-lg font-bold">
          CMS Admin Panel
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r transition-transform duration-300 md:static md:translate-x-0',
            darkMode ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-200 bg-white',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between border-b pb-6 border-zinc-800/50">
                <Link to="/" target="_blank" className="group flex items-center gap-2 font-serif text-xl font-bold tracking-wide">
                  <span>CMS Admin</span>
                  <ExternalLink size={14} className="text-zinc-500 transition-colors group-hover:text-gold" />
                </Link>
              </div>

              <nav className="mt-8 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/admin'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors',
                          isActive
                            ? 'bg-gold/15 text-gold border-l-2 border-gold font-semibold'
                            : darkMode
                              ? 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                        )
                      }
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="border-t pt-6 border-zinc-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 truncate max-w-[140px]">{adminEmail}</span>
                <button
                  type="button"
                  onClick={() => setDarkMode((v) => !v)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/10 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-600 hover:text-white"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
