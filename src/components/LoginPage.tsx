import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Employee } from "./EmployeeDialog";
import { Customer } from "./CustomerDialog";

interface LoginPageProps {
  onLogin: (email: string, password: any , role: "admin" | "employee" | "customer") => void;
  onSignup: (userData: any, role: "employee" | "customer") => void;
  employees: Employee[];
  customers: Customer[];
}

export function LoginPage({ onLogin, onSignup, employees, customers }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "employee" | "customer">("admin");
  
  // Signup state
  const [signupRole, setSignupRole] = useState<"employee" | "customer">("employee");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!loginEmail || !loginPassword) {
      setError("Please Check If you entered the right email and password");
      return;
    }

    // Check if user exists in the system
    if (loginRole === "admin") {
      // Allow admin login with any credentials (you can add proper admin validation)
      onLogin(loginEmail, loginPassword, "admin");
    } else if (loginRole === "employee") {
      const employeeExists = employees.find(e => e.email === loginEmail);
      if (!employeeExists) {
        setError("No account found with this email. Please sign up first.");
        return;
      }
      onLogin(loginEmail, loginPassword, "employee");
    } else if (loginRole === "customer") {
      const customerExists = customers.find(c => c.email === loginEmail);
      if (!customerExists) {
        setError("No account found with this email. Please sign up first.");
        return;
      }
      onLogin(loginEmail, loginPassword, "customer");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!signupName || !signupEmail || !signupPassword || !signupPhone) {
      setError("Please fill in all required fields");
      return;
    }

    // Check if email already exists
    const emailExists = signupRole === "employee" 
      ? employees.find(e => e.email === signupEmail)
      : customers.find(c => c.email === signupEmail);
    
    if (emailExists) {
      setError("An account with this email already exists");
      return;
    }

    const userData = signupRole === "employee" 
      ? {
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
          status: "Active" as const,
        }
      : {
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
          plan: "Free" as const,
          status: "Active" as const,
        };

    onSignup(userData, signupRole);
    
    // Reset form
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPhone("");
    
    // Switch to login tab
    setActiveTab("login");
    setError("");
    alert(`Account created successfully! You can now log in.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Shield className="h-8 w-8 text-gray-900 dark:text-gray-100" />
          </div>
          <h1 className="mb-2 text-gray-900 dark:text-white">Ticket Management System</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your support tickets efficiently</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900">
                Sign In
              </Button>
              
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-4">
                Don't have an account? Sign up to get started.
              </p>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">First Name *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your first name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
                <Label htmlFor="signup-name">Second Name *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your Second name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone *</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>
              
              {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
              
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900">
                Create Account
              </Button>
              
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-4">
                Already have an account? Log in above.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
