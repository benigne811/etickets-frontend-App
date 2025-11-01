import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Urgent Ticket",
    message: "T-001: Login page not loading - Requires immediate attention",
    time: "5 minutes ago",
    read: false,
    type: "warning",
  },
  {
    id: "2",
    title: "Ticket Resolved",
    message: "T-005: Email notifications issue has been resolved by Mike Johnson",
    time: "2 hours ago",
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "New Employee Added",
    message: "David Chen has been added to the system",
    time: "3 hours ago",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Ticket Assigned",
    message: "T-003: Database timeout has been assigned to you",
    time: "5 hours ago",
    read: true,
    type: "info",
  },
  {
    id: "5",
    title: "System Update",
    message: "System maintenance scheduled for tonight at 2 AM",
    time: "1 day ago",
    read: true,
    type: "warning",
  },
];

export function NotificationDropdown() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h4 className="mb-0">Notifications</h4>
            {unreadCount > 0 && (
              <p className="text-muted-foreground">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        <ScrollArea className="h-96">
          <div className="divide-y divide-border">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="mb-0">{notification.title}</h4>
                  {!notification.read && (
                    <Badge variant="default" className="text-xs px-2 py-0">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <p className="text-muted-foreground">{notification.time}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full">
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}