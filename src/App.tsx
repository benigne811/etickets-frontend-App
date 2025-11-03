import { useState, useEffect } from "react";
import { TicketDialog, Ticket } from "./components/TicketDialog";
import { Employee, EmployeeDialog } from "./components/EmployeeDialog";
import { CreateTicketDialog } from "./components/CreateTicketDialog";
import { LoginPage } from "./components/LoginPage";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { RealDashboardPage } from "./components/pages/RealDashboardPage";
import { TicketsPage } from "./components/pages/TicketsPage";
import { EmployeesPage } from "./components/pages/EmployeesPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import {
  getTickets,
  saveTickets,
  getEmployees,
  saveEmployees,
  getCurrentUser,
  saveCurrentUser,
  getIsAuthenticated,
  saveIsAuthenticated,
  clearAuth,
  verifyUserCredential,
  findUserByEmail,
  addUserCredential,
} from "./utils/storage";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface User {
  email: string;
  role: "admin" | "employee";
  data: Employee | null;
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [employeeDialogMode, setEmployeeDialogMode] = useState<"add" | "edit">(
    "add"
  );

  const [activePage, setActivePage] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedTickets = getTickets();
      const savedEmployees = getEmployees();
      const savedUser = getCurrentUser();
      const savedAuth = getIsAuthenticated();

      const adminEmail = "benigne811@gmail.com";
      const adminPassword = "123456";
      const adminExists = findUserByEmail(adminEmail);

      if (!adminExists) {
        addUserCredential({
          email: adminEmail.toLowerCase(),
          password: adminPassword,
          role: "admin",
        });
      }

      if (savedTickets.length > 0) {
        setTickets(savedTickets);
      }
      if (savedEmployees.length > 0) {
        setEmployees(savedEmployees);
      }
      if (savedUser && savedAuth) {
        setCurrentUser(savedUser);
        setIsAuthenticated(savedAuth);
      }
    } catch (error) {
      console.error("Error loading data from storage:", error);
      toast.error("Failed to load saved data");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      saveTickets(tickets);
    } catch (error) {
      console.error("Error saving tickets:", error);
      toast.error("Failed to save tickets");
    }
  }, [tickets]);

  useEffect(() => {
    try {
      saveEmployees(employees);
    } catch (error) {
      console.error("Error saving employees:", error);
      toast.error("Failed to save employees");
    }
  }, [employees]);

  useEffect(() => {
    try {
      if (currentUser) {
        saveCurrentUser(currentUser);
      }
      saveIsAuthenticated(isAuthenticated);
    } catch (error) {
      console.error("Error saving auth state:", error);
    }
  }, [currentUser, isAuthenticated]);

  const handleLogin = (
    email: string,
    password: string,
    role: "admin" | "employee"
  ) => {
    try {
      if (role === "admin") {
        const credential = verifyUserCredential(email, password);
        if (!credential || credential.role !== "admin") {
          toast.error("Login failed: Wrong email or password");
          return;
        }
        const user: User = { email, role: "admin", data: null };
        setCurrentUser(user);
        setIsAuthenticated(true);
        toast.success("Logged in as admin");
      } else if (role === "employee") {
        const credential = verifyUserCredential(email, password);
        if (!credential || credential.role !== "employee") {
          toast.error("Login failed: Wrong email or password");
          return;
        }

        const employee = employees.find(
          (e) => e.email.toLowerCase() === email.toLowerCase()
        );
        if (!employee) {
          toast.error("Login failed: Wrong email or password");
          return;
        }

        const user: User = {
          email,
          role: "employee",
          data: employee,
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${employee.name}!`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  const handleSignup = (userData: any, role: "employee") => {
    try {
      if (role === "employee") {
        const emailExists = employees.find(
          (e) => e.email.toLowerCase() === userData.email.toLowerCase()
        );
        if (emailExists) {
          toast.error("An account with this email already exists");
          return;
        }

        const credentialExists = findUserByEmail(userData.email);
        if (credentialExists) {
          toast.error("An account with this email already exists");
          return;
        }

        const newEmployee: Employee = {
          ...userData,
          id: `E${String(employees.length + 1).padStart(3, "0")}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          assignedTickets: 0,
        };

        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        saveEmployees(updatedEmployees);

        addUserCredential({
          email: userData.email.toLowerCase(),
          password: userData.password,
          role: "employee",
        });

        toast.success("Account created successfully! You can now log in.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    }
  };

  const handleLogout = () => {
    try {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActivePage("dashboard");
      clearAuth();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    try {
      const updatedTickets = tickets.map((t) =>
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
          : t
      );
      setTickets(updatedTickets);
      saveTickets(updatedTickets);
      toast.success("Ticket updated successfully");
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  const handleAssignTicket = (ticketId: string, employeeName: string) => {
    try {
      const updatedTickets = tickets.map((t) => {
        if (t.id === ticketId) {
          if (t.assignee !== "Unassigned" && t.assignee !== employeeName) {
            const oldEmployee = employees.find((e) => e.name === t.assignee);
            if (oldEmployee) {
              const updatedEmployees = employees.map((e) =>
                e.id === oldEmployee.id
                  ? {
                      ...e,
                      assignedTickets: Math.max(0, e.assignedTickets - 1),
                    }
                  : e
              );
              setEmployees(updatedEmployees);
              saveEmployees(updatedEmployees);
            }
          }

          if (employeeName !== "Unassigned") {
            const newEmployee = employees.find((e) => e.name === employeeName);
            if (newEmployee) {
              const updatedEmployees = employees.map((e) =>
                e.id === newEmployee.id
                  ? {
                      ...e,
                      assignedTickets: e.assignedTickets + 1,
                    }
                  : e
              );
              setEmployees(updatedEmployees);
              saveEmployees(updatedEmployees);
            }
          }

          return {
            ...t,
            assignee: employeeName,
            status: employeeName === "Unassigned" ? "Open" : "In Progress",
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
          };
        }
        return t;
      });
      setTickets(updatedTickets);
      saveTickets(updatedTickets);
      toast.success("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const handleCreateTicket = (ticketData: {
    title: string;
    description: string;
    priority: string;
    reporter: string;
  }) => {
    try {
      if (
        !ticketData.reporter ||
        !ticketData.title ||
        !ticketData.description
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newTicket: Ticket = {
        id: `T-${String(tickets.length + 1).padStart(3, "0")}`,
        title: ticketData.title.trim(),
        description: ticketData.description.trim(),
        status: "Open",
        priority: ticketData.priority,
        assignee: "Unassigned",
        reporter: ticketData.reporter.trim(),
        createdAt: formattedDate,
        updatedAt: formattedDate,
      };

      const updatedTickets = [newTicket, ...tickets];
      setTickets(updatedTickets);
      saveTickets(updatedTickets);
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

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
    employeeData: Omit<Employee, "id" | "avatar" | "assignedTickets"> & {
      id?: string;
    }
  ) => {
    try {
      if (!employeeData.name || !employeeData.email || !employeeData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (employeeData.id) {
        const updatedEmployees = employees.map((e) =>
          e.id === employeeData.id ? { ...e, ...employeeData } : e
        );
        setEmployees(updatedEmployees);
        saveEmployees(updatedEmployees);
        toast.success("Employee updated successfully");
      } else {
        const emailExists = employees.find(
          (e) => e.email.toLowerCase() === employeeData.email.toLowerCase()
        );
        if (emailExists) {
          toast.error("An employee with this email already exists");
          return;
        }

        const newEmployee: Employee = {
          ...employeeData,
          id: `E${String(employees.length + 1).padStart(3, "0")}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeData.name}`,
          assignedTickets: 0,
        };
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        saveEmployees(updatedEmployees);
        toast.success("Employee added successfully");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee");
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    try {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) {
        toast.error("Employee not found");
        return;
      }

      if (
        window.confirm(
          "Are you sure you want to delete this employee? This will unassign all their tickets."
        )
      ) {
        const updatedTickets = tickets.map((t) =>
          t.assignee === employee.name
            ? { ...t, assignee: "Unassigned", status: "Open" }
            : t
        );
        setTickets(updatedTickets);
        saveTickets(updatedTickets);

        const updatedEmployees = employees.filter((e) => e.id !== employeeId);
        setEmployees(updatedEmployees);
        saveEmployees(updatedEmployees);
        toast.success("Employee deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  const renderAdminPage = () => {
    switch (activePage) {
      case "dashboard":
        return <RealDashboardPage tickets={tickets} employees={employees} />;
      case "tickets":
        return (
          <TicketsPage
            tickets={tickets}
            employees={employees}
            onTicketClick={handleTicketClick}
            onAssignTicket={handleAssignTicket}
            onCreateTicketClick={() => setIsCreateTicketDialogOpen(true)}
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
      case "settings":
        return <SettingsPage />;
      default:
        return <RealDashboardPage tickets={tickets} employees={employees} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        <LoginPage
          onLogin={handleLogin}
          onSignup={handleSignup}
          employees={employees}
        />
      </>
    );
  }

  if (currentUser?.role === "employee") {
    return (
      <>
        <Toaster />
        <EmployeeDashboard
          employee={currentUser.data as Employee}
          tickets={tickets}
          onUpdateTicket={handleUpdateTicket}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto">{renderAdminPage()}</main>
        </div>

        <TicketDialog
          ticket={selectedTicket}
          open={isTicketDialogOpen}
          onOpenChange={setIsTicketDialogOpen}
          onUpdate={handleUpdateTicket}
          employees={employees}
        />

        <CreateTicketDialog
          open={isCreateTicketDialogOpen}
          onOpenChange={setIsCreateTicketDialogOpen}
          employees={employees}
          onCreateTicket={handleCreateTicket}
        />

        <EmployeeDialog
          open={isEmployeeDialogOpen}
          onOpenChange={setIsEmployeeDialogOpen}
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          mode={employeeDialogMode}
        />
      </div>
    </>
  );
}
