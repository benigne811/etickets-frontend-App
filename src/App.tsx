import { useState, useEffect } from "react";
import {
  TicketDialog,
  Ticket,
} from "./components/TicketDialog";
import {
  Employee,
  EmployeeDialog,
} from "./components/EmployeeDialog";
import {
  Customer,
  CustomerDialog,
} from "./components/CustomerDialog";
import { CreateTicketDialog } from "./components/CreateTicketDialog";
import { LoginPage } from "./components/LoginPage";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { RealDashboardPage } from "./components/pages/RealDashboardPage";
import { TicketsPage } from "./components/pages/TicketsPage";
import { EmployeesPage } from "./components/pages/EmployeesPage";
import { CustomersPage } from "./components/pages/CustomersPage";
import { SettingsPage } from "./components/pages/SettingsPage";

interface User {
  email: string;
  role: "admin" | "employee" | "customer";
  data: Employee | Customer | null;
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] =
    useState(false);
  const [
    isCreateTicketDialogOpen,
    setIsCreateTicketDialogOpen,
  ] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] =
    useState(false);
  const [employeeDialogMode, setEmployeeDialogMode] = useState<
    "add" | "edit"
  >("add");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] =
    useState(false);
  const [customerDialogMode, setCustomerDialogMode] = useState<
    "add" | "edit"
  >("add");

  const [activePage, setActivePage] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Login handler
  const handleLogin = (
    email: string,
    password: string,
    role: "admin" | "employee" | "customer",
  ) => {
    // Authentication with validation
    if (role === "admin") {
      // Simple admin check - you can enhance this
      setCurrentUser({ email, role: "admin", data: null });
      setIsAuthenticated(true);
    } else if (role === "employee") {
      const employee = employees.find((e) => e.email === email);
      if (employee) {
        setCurrentUser({
          email,
          role: "employee",
          data: employee,
        });
        setIsAuthenticated(true);
      }
    } else if (role === "customer") {
      const customer = customers.find((c) => c.email === email);
      if (customer) {
        setCurrentUser({
          email,
          role: "customer",
          data: customer,
        });
        setIsAuthenticated(true);
      }
    }
  };

  // Signup handler
  const handleSignup = (
    userData: any,
    role: "employee" | "customer",
  ) => {
    if (role === "employee") {
      const newEmployee: Employee = {
        ...userData,
        id: `E${String(employees.length + 1).padStart(3, "0")}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        assignedTickets: 0,
      };
      setEmployees([...employees, newEmployee]);
    } else if (role === "customer") {
      const newCustomer: Customer = {
        ...userData,
        id: `C${String(customers.length + 1).padStart(3, "0")}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
        joinedDate: new Date().toISOString().split("T")[0],
        totalTickets: 0,
      };
      setCustomers([...customers, newCustomer]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActivePage("dashboard");
  };

  // Ticket handlers
  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(
      tickets.map((t) =>
        t.id === updatedTicket.id
          ? {
              ...updatedTicket,
              updatedAt: new Date()
                .toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .replace(",", ""),
            }
          : t,
      ),
    );
  };

  const handleAssignTicket = (
    ticketId: string,
    employeeName: string,
  ) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          // Update employee ticket counts
          if (
            t.assignee !== "Unassigned" &&
            t.assignee !== employeeName
          ) {
            const oldEmployee = employees.find(
              (e) => e.name === t.assignee,
            );
            if (oldEmployee) {
              setEmployees(
                employees.map((e) =>
                  e.id === oldEmployee.id
                    ? {
                        ...e,
                        assignedTickets: e.assignedTickets - 1,
                      }
                    : e,
                ),
              );
            }
          }

          if (employeeName !== "Unassigned") {
            const newEmployee = employees.find(
              (e) => e.name === employeeName,
            );
            if (newEmployee) {
              setEmployees(
                employees.map((e) =>
                  e.id === newEmployee.id
                    ? {
                        ...e,
                        assignedTickets: e.assignedTickets + 1,
                      }
                    : e,
                ),
              );
            }
          }

          return {
            ...t,
            assignee: employeeName,
            status:
              employeeName === "Unassigned"
                ? "Open"
                : "In Progress",
          };
        }
        return t;
      }),
    );
  };

  const handleCreateTicket = (ticketData: {
    title: string;
    description: string;
    priority: string;
    customerId: string;
  }) => {
    const customer = customers.find(
      (c) => c.id === ticketData.customerId,
    );
    if (!customer) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newTicket: Ticket = {
      id: `T-${String(tickets.length + 1).padStart(3, "0")}`,
      title: ticketData.title,
      description: ticketData.description,
      status: "Open",
      priority: ticketData.priority,
      assignee: "Unassigned",
      reporter: customer.name,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    setTickets([newTicket, ...tickets]);

    // Update customer ticket count
    setCustomers(
      customers.map((c) =>
        c.id === ticketData.customerId
          ? { ...c, totalTickets: c.totalTickets + 1 }
          : c,
      ),
    );
  };

  // Customer creates ticket (from customer dashboard)
  const handleCustomerCreateTicket = (ticketData: {
    title: string;
    description: string;
    priority: string;
  }) => {
    if (!currentUser || currentUser.role !== "customer") return;
    const customer = currentUser.data as Customer;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newTicket: Ticket = {
      id: `T-${String(tickets.length + 1).padStart(3, "0")}`,
      title: ticketData.title,
      description: ticketData.description,
      status: "Open",
      priority: ticketData.priority,
      assignee: "Unassigned",
      reporter: customer.name,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    setTickets([newTicket, ...tickets]);

    // Update customer ticket count
    setCustomers(
      customers.map((c) =>
        c.id === customer.id
          ? { ...c, totalTickets: c.totalTickets + 1 }
          : c,
      ),
    );
  };

  // Employee handlers
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeDialogMode("add");
    setIsEmployeeDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeDialogMode("edit");
    setIsEmployeeDialogOpen(true);
  };

  const handleSaveEmployee = (
    employeeData: Omit<
      Employee,
      "id" | "avatar" | "assignedTickets"
    > & { id?: string },
  ) => {
    if (employeeData.id) {
      // Edit existing
      setEmployees(
        employees.map((e) =>
          e.id === employeeData.id
            ? { ...e, ...employeeData }
            : e,
        ),
      );
    } else {
      // Add new
      const newEmployee: Employee = {
        ...employeeData,
        id: `E${String(employees.length + 1).padStart(3, "0")}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeData.name}`,
        assignedTickets: 0,
      };
      setEmployees([...employees, newEmployee]);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (
      confirm("Are you sure you want to delete this employee?")
    ) {
      const employee = employees.find(
        (e) => e.id === employeeId,
      );
      if (employee) {
        // Unassign their tickets
        setTickets(
          tickets.map((t) =>
            t.assignee === employee.name
              ? { ...t, assignee: "Unassigned", status: "Open" }
              : t,
          ),
        );
      }
      setEmployees(
        employees.filter((e) => e.id !== employeeId),
      );
    }
  };

  // Customer handlers
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerDialogMode("add");
    setIsCustomerDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDialogMode("edit");
    setIsCustomerDialogOpen(true);
  };

  const handleSaveCustomer = (
    customerData: Omit<
      Customer,
      "id" | "avatar" | "joinedDate" | "totalTickets"
    > & { id?: string },
  ) => {
    if (customerData.id) {
      // Edit existing
      setCustomers(
        customers.map((c) =>
          c.id === customerData.id
            ? { ...c, ...customerData }
            : c,
        ),
      );
    } else {
      // Add new
      const newCustomer: Customer = {
        ...customerData,
        id: `C${String(customers.length + 1).padStart(3, "0")}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customerData.name}`,
        joinedDate: new Date().toISOString().split("T")[0],
        totalTickets: 0,
      };
      setCustomers([...customers, newCustomer]);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (
      confirm("Are you sure you want to delete this customer?")
    ) {
      setCustomers(
        customers.filter((c) => c.id !== customerId),
      );
    }
  };

  // Admin page rendering
  const renderAdminPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <RealDashboardPage
            tickets={tickets}
            employees={employees}
            customers={customers}
          />
        );
      case "tickets":
        return (
          <TicketsPage
            tickets={tickets}
            employees={employees}
            customers={customers}
            onTicketClick={handleTicketClick}
            onAssignTicket={handleAssignTicket}
            onCreateTicketClick={() =>
              setIsCreateTicketDialogOpen(true)
            }
          />
        );
      case "employees":
        return (
          <EmployeesPage
            employees={employees}
            onAddClick={handleAddEmployee}
            onEditClick={handleEditEmployee}
            onDeleteClick={handleDeleteEmployee}
          />
        );
      case "customers":
        return (
          <CustomersPage
            customers={customers}
            onAddClick={handleAddCustomer}
            onEditClick={handleEditCustomer}
            onDeleteClick={handleDeleteCustomer}
          />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <RealDashboardPage
            tickets={tickets}
            employees={employees}
            customers={customers}
          />
        );
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onSignup={handleSignup}
        employees={employees}
        customers={customers}
      />
    );
  }

  // Employee Dashboard
  if (currentUser?.role === "employee") {
    return (
      <EmployeeDashboard
        employee={currentUser.data as Employee}
        tickets={tickets}
        onUpdateTicket={handleUpdateTicket}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  // Customer Dashboard
  if (currentUser?.role === "customer") {
    return (
      <CustomerDashboard
        customer={currentUser.data as Customer}
        tickets={tickets}
        onCreateTicket={handleCustomerCreateTicket}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  // Admin Dashboard
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 overflow-y-auto">
          {renderAdminPage()}
        </main>
      </div>

      {/* Ticket Dialog */}
      <TicketDialog
        ticket={selectedTicket}
        open={isTicketDialogOpen}
        onOpenChange={setIsTicketDialogOpen}
        onUpdate={handleUpdateTicket}
      />

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        open={isCreateTicketDialogOpen}
        onOpenChange={setIsCreateTicketDialogOpen}
        customers={customers}
        onCreateTicket={handleCreateTicket}
      />

      {/* Employee Dialog */}
      <EmployeeDialog
        open={isEmployeeDialogOpen}
        onOpenChange={setIsEmployeeDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        mode={employeeDialogMode}
      />

      {/* Customer Dialog */}
      <CustomerDialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
        mode={customerDialogMode}
      />
    </div>
  );
}