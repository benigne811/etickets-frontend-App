import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Employee } from "./EmployeeDialog";

interface LoginPageProps {
  onLogin: (email: string, password: string, role: "admin" | "employee") => void;
  onSignup: (userData: any, role: "employee") => void;
  employees: Employee[];
}

export function LoginPage({ onLogin, onSignup, employees }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "employee">("admin");
  
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupDepartment, setSignupDepartment] = useState("");
  const [signupRoleTitle, setSignupRoleTitle] = useState("");
  
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        setError("Please enter both email and password");
        return;
      }

      if (!validateEmail(loginEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      onLogin(loginEmail, loginPassword, loginRole);
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim() || !signupPhone.trim() || !signupDepartment.trim() || !signupRoleTitle.trim()) {
        setError("Please fill in all required fields");
        return;
      }

      if (!validateEmail(signupEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      if (signupPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const emailExists = employees.find(e => e.email.toLowerCase() === signupEmail.toLowerCase());
      
      if (emailExists) {
        setError("An account with this email already exists");
        return;
      }

      const userData = {
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        phone: signupPhone.trim(),
        department: signupDepartment,
        role: signupRoleTitle.trim(),
        status: "Active" as const,
      };

      onSignup(userData, "employee");
      
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupPhone("");
      setSignupDepartment("");
      setSignupRoleTitle("");
      
      setActiveTab("login");
      setError("");
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
      console.error("Signup error:", err);
    }
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
                <Label htmlFor="login-role">Role</Label>
                <Select value={loginRole} onValueChange={(value: "admin" | "employee") => setLoginRole(value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <Label htmlFor="signup-name">Full Name *</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="Enter your password (min. 6 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone *</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-department">Department *</Label>
                <Select 
                  value={signupDepartment} 
                  onValueChange={setSignupDepartment}
                  required
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-role">Role *</Label>
                <Input
                  id="signup-role"
                  type="text"
                  placeholder="Senior Developer"
                  value={signupRoleTitle}
                  onChange={(e) => setSignupRoleTitle(e.target.value)}
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
