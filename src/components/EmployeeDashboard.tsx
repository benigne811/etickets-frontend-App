import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Ticket, TicketDialog } from "./TicketDialog";
import { Employee } from "./EmployeeDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  LogOut, 
  Search, 
  User, 
  Briefcase,
  Mail,
  Phone,
  Filter
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface EmployeeDashboardProps {
  employee: Employee;
  tickets: Ticket[];
  onUpdateTicket: (ticket: Ticket) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function EmployeeDashboard({ employee, tickets, onUpdateTicket, onLogout, isDarkMode, onThemeToggle }: EmployeeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter tickets assigned to this employee
  const myTickets = useMemo(() => {
    return tickets.filter(t => t.assignee === employee.name);
  }, [tickets, employee.name]);

  const filteredTickets = useMemo(() => {
    let filtered = myTickets;
    
    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "open") {
        filtered = filtered.filter(t => t.status === "Open");
      } else if (activeTab === "in-progress") {
        filtered = filtered.filter(t => t.status === "In Progress");
      } else if (activeTab === "resolved") {
        filtered = filtered.filter(t => t.status === "Resolved" || t.status === "Closed");
      }
    }
    
    // Apply search and status filter
    return filtered.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myTickets, searchQuery, statusFilter, activeTab]);

  const openTickets = myTickets.filter(t => t.status === "Open").length;
  const inProgressTickets = myTickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = myTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;
  const totalTickets = myTickets.length;

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700";
      case "In Progress": return "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600";
      case "Resolved": return "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 border-gray-900 dark:border-gray-300";
      case "Closed": return "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300 border-gray-400 dark:border-gray-500";
      default: return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
      case "Medium": return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600";
      case "High": return "bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900 border-gray-800 dark:border-gray-400";
      case "Urgent": return "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                  <User className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="mb-0 text-gray-900 dark:text-white">{employee.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Briefcase className="h-3 w-3" />
                    <span>{employee.role}</span>
                    <span>•</span>
                    <span>{employee.department}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onThemeToggle} className="rounded-lg">
                {isDarkMode ? "🌞" : "🌙"}
              </Button>
              <Button variant="outline" onClick={onLogout} className="rounded-lg border-gray-300 dark:border-gray-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="mb-1 text-gray-900 dark:text-white">Welcome back, {employee.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's an overview of your assigned support tickets</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-gray-300 dark:border-gray-700">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl mb-1 text-gray-900 dark:text-white">{totalTickets}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Tickets</div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl mb-1 text-gray-900 dark:text-white">{openTickets}</div>
                <div className="text-gray-600 dark:text-gray-400">Open</div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl mb-1 text-gray-900 dark:text-white">{inProgressTickets}</div>
                <div className="text-gray-600 dark:text-gray-400">In Progress</div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl mb-1 text-gray-900 dark:text-white">{resolvedTickets}</div>
                <div className="text-gray-600 dark:text-gray-400">Resolved</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tickets Section */}
        <Card className="p-6 space-y-6 border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="mb-1 text-gray-900 dark:text-white">My Assigned Tickets</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage and resolve your assigned support requests</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                All
                <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-700">{myTickets.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                Open
                <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-700">{openTickets}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                In Progress
                <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-700">{inProgressTickets}</Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                Resolved
                <Badge variant="secondary" className="ml-1 bg-gray-200 dark:bg-gray-700">{resolvedTickets}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Search by ticket ID or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-gray-300 dark:border-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tickets Table */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                {filteredTickets.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-gray-900 dark:text-white">No tickets found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {myTickets.length === 0 
                        ? "You don't have any assigned tickets yet."
                        : "No tickets match your current filters."}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-gray-50 dark:bg-gray-800">
                        <TableHead className="text-gray-700 dark:text-gray-300">Ticket ID</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Customer</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Priority</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleTicketClick(ticket)}
                        >
                          <TableCell>
                            <span className="font-mono text-gray-900 dark:text-white">{ticket.id}</span>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-sm truncate text-gray-900 dark:text-white">{ticket.title}</div>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">{ticket.reporter}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{ticket.createdAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Ticket Dialog */}
      <TicketDialog
        ticket={selectedTicket}
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        onUpdate={onUpdateTicket}
      />
    </div>
  );
}
