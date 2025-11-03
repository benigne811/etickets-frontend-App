import { Search, Moon, Sun, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NotificationDropdown } from "./NotificationDropdown";

interface TopBarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
}

export function TopBar({ isDarkMode, onThemeToggle, onLogout }: TopBarProps) {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search tickets, employees..."
              className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </Button>
          
          <NotificationDropdown />
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">Admin User</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Administrator</div>
            </div>
            <Avatar className="h-9 w-9 border-2 border-gray-900 dark:border-white">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
              <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">AD</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
