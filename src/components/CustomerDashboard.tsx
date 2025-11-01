import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Ticket, TicketDialog } from "./TicketDialog";
import { Customer } from "./CustomerDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  LogOut, 
  Search, 
  Plus, 
  UserCircle, 
  Building,
  Mail,
  Phone,
  Calendar,
  Filter,
  MessageSquare
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface CustomerDashboardProps {
  customer: Customer;
  tickets: Ticket[];
  onCreateTicket: (ticketData: { title: string; description: string; priority: string }) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function CustomerDashboard({ customer, tickets, onCreateTicket, onLogout, isDarkMode, onThemeToggle }: CustomerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  // Filter tickets for this customer
  const myTickets = useMemo(() => {
    return tickets.filter(t => t.reporter === customer.name);
  }, [tickets, customer.name]);

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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket(newTicket);
    setNewTicket({ title: "", description: "", priority: "Medium" });
    setIsCreateDialogOpen(false);
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
                  <UserCircle className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="mb-0 text-gray-900 dark:text-white">{customer.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building className="h-3 w-3" />
                    <span>{customer.company}</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="mb-1 text-gray-900 dark:text-white">Hello, {customer.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome to your support center</p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            size="lg"
            className="self-start sm:self-auto bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-gray-300 dark:border-gray-700">
                <AvatarImage src={customer.avatar} />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(customer.joinedDate).toLocaleDateString()}</span>
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

        {/* Support Message */}
        <Card className="p-6 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-white dark:text-gray-900" />
            </div>
            <div>
              <h3 className="mb-1 text-gray-900 dark:text-white">Need help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Our support team is here to assist you. Create a ticket and we'll get back to you as soon as possible.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit a Request
              </Button>
            </div>
          </div>
        </Card>

        {/* Tickets Section */}
        <Card className="p-6 space-y-6 border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="mb-1 text-gray-900 dark:text-white">My Support Tickets</h2>
            <p className="text-gray-600 dark:text-gray-400">Track the status of your submitted requests</p>
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
                    placeholder="Search your tickets..."
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
                      <MessageSquare className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-gray-900 dark:text-white">No tickets found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {myTickets.length === 0 
                        ? "You haven't created any support tickets yet."
                        : "No tickets match your current filters."}
                    </p>
                    {myTickets.length === 0 && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Ticket
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent bg-gray-50 dark:bg-gray-800">
                        <TableHead className="text-gray-700 dark:text-gray-300">Ticket ID</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Priority</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-300">Assigned To</TableHead>
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
                          <TableCell>
                            {ticket.assignee === "Unassigned" ? (
                              <span className="text-gray-500 dark:text-gray-400 italic">Unassigned</span>
                            ) : (
                              <span className="text-gray-900 dark:text-white">{ticket.assignee}</span>
                            )}
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

      {/* Ticket Dialog (View Only) */}
      <TicketDialog
        ticket={selectedTicket}
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        onUpdate={() => {}} // Customers can only view
      />

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <Plus className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
              Create New Support Ticket
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Tell us about your issue and our support team will help you resolve it.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Issue Title *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                placeholder="Brief summary of your issue"
                className="border-gray-300 dark:border-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Description *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Please provide as much detail as possible about your issue..."
                rows={5}
                className="border-gray-300 dark:border-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority Level</Label>
              <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - General inquiry</SelectItem>
                  <SelectItem value="Medium">Medium - Issue affecting work</SelectItem>
                  <SelectItem value="High">High - Significant impact</SelectItem>
                  <SelectItem value="Urgent">Urgent - Critical issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-gray-300 dark:border-gray-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900">
                <Plus className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
