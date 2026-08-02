import { useState } from 'react';
import { 
  LayoutDashboard, Edit3, Folder, FileEdit, Image as ImageIcon, 
  MessageSquare, Settings, Megaphone, CheckCircle2, ChevronDown, 
  ChevronRight, Tags, LayoutTemplate, Users, Activity, Trash2, 
  Link as LinkIcon, Briefcase, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { 
    name: 'Posts', 
    icon: Edit3,
    children: [
      { name: 'All Posts', id: 'Posts' },
      { name: 'Add New', id: 'Create Post' },
      { name: 'Drafts', id: 'Drafts' },
      { name: 'Scheduled', id: 'Scheduled' },
      { name: 'Published', id: 'Published' },
      { name: 'Trash', id: 'Trash' }
    ]
  },
  { 
    name: 'Special Post Builders', 
    icon: LayoutTemplate,
    children: [
      { name: 'Job Post', id: 'Job Builder' },
      { name: 'Current Affairs', id: 'Current Affairs Builder' },
      { name: 'Table Generator', id: 'Table Generator' }
    ]
  },
  { name: 'Categories', icon: Folder },
  { name: 'Tags', icon: Tags },
  { name: 'Study Materials', icon: FileText },
  { name: 'Media Library', icon: ImageIcon },
  { name: 'Pages', icon: FileEdit },
  { name: 'Comments', icon: MessageSquare },
  { name: 'Advertisement', icon: Megaphone },
  { 
    name: 'Appearance', 
    icon: LayoutTemplate,
    children: [
      { name: 'Theme Settings', id: 'Theme Settings' },
      { name: 'Menus', id: 'Menus' },
      { name: 'Widgets', id: 'Widgets' }
    ]
  },
  { name: 'Users', icon: Users },
  { name: 'Tools', icon: Activity },
  { name: 'Website Settings', icon: Settings }
];

export default function AdminSidebar({ activeTab, setActiveTab, isCollapsed, setIsMobileMenuOpen }: AdminSidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Posts');

  const toggleMenu = (name: string) => {
    if (expandedMenu === name) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(name);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
        {isCollapsed ? (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
              C
            </div>
            <span className="text-xl font-bold text-white tracking-tight truncate">Career Notice</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          {MENU_ITEMS.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                      (item.children.some(child => child.id === activeTab)) || expandedMenu === item.name
                        ? "bg-slate-800 text-white" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5 shrink-0", 
                        (item.children.some(child => child.id === activeTab)) ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400"
                      )} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform", expandedMenu === item.name ? "rotate-180" : "")} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedMenu === item.name && !isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-11 pr-3 py-2 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleTabClick(child.id)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                activeTab === child.id
                                  ? "bg-blue-600/10 text-blue-400"
                                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                              )}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => handleTabClick(item.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                    activeTab === item.name 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", 
                    activeTab === item.name ? "text-white" : "text-slate-500 group-hover:text-slate-400"
                  )} />
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">Admin User</span>
              <span className="text-xs text-slate-500 truncate">Administrator</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-700 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
        )}
      </div>
    </div>
  );
}

// Temporary User icon mock since it wasn't imported at top
function User(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
