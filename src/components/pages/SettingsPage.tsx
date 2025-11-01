import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, Building, Bell, Shield, Palette, Save } from "lucide-react";

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="mb-4">Profile Information</h3>
              <p className="text-muted-foreground mb-6">
                Update your account profile information and email address.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" className="mb-2">
                  Change Avatar
                </Button>
                <p className="text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input defaultValue="Admin" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input defaultValue="User" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" defaultValue="admin@ticketflow.com" />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" defaultValue="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Tell us about yourself..."
                defaultValue="System administrator with 5+ years of experience managing ticketing systems."
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button className="shadow-md">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="mb-4">Company Information</h3>
              <p className="text-muted-foreground mb-6">
                Update your company details and business information.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue="TicketFlow Inc." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input defaultValue="Software Development" />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Input defaultValue="50-100 employees" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="123 Tech Street, San Francisco, CA 94102" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input defaultValue="https://ticketflow.com" />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" defaultValue="support@ticketflow.com" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="shadow-md">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="mb-4">Notification Preferences</h3>
              <p className="text-muted-foreground mb-6">
                Manage how you receive notifications and updates.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="mb-1">Email Notifications</Label>
                  <p className="text-muted-foreground">
                    Receive email notifications for new tickets and updates
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="mb-1">Push Notifications</Label>
                  <p className="text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="mb-1">Weekly Reports</Label>
                  <p className="text-muted-foreground">
                    Receive weekly summary reports via email
                  </p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Notification Email</Label>
                <Input type="email" defaultValue="admin@ticketflow.com" />
                <p className="text-muted-foreground">
                  This email will receive all notification messages
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="shadow-md">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="mb-4">Security Settings</h3>
              <p className="text-muted-foreground mb-6">
                Manage your password and security preferences.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Change Password</Label>
              <div className="space-y-3">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline">Update Password</Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="mb-1">Two-Factor Authentication</Label>
                <p className="text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Active Sessions</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium mb-1">Current Session</div>
                    <p className="text-muted-foreground">
                      Chrome on macOS • San Francisco, CA
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="mb-4">Appearance Settings</h3>
              <p className="text-muted-foreground mb-6">
                Customize how TicketFlow looks on your device.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Theme</Label>
              <p className="text-muted-foreground mb-4">
                Use the theme toggle in the top bar to switch between light and dark mode.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-video bg-white rounded mb-3 border border-border"></div>
                  <div className="font-medium">Light Mode</div>
                </div>
                <div className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-video bg-slate-900 rounded mb-3 border border-border"></div>
                  <div className="font-medium">Dark Mode</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Display Density</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" name="density" id="comfortable" defaultChecked />
                  <Label htmlFor="comfortable" className="font-normal cursor-pointer">
                    Comfortable - More spacing between elements
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="density" id="compact" />
                  <Label htmlFor="compact" className="font-normal cursor-pointer">
                    Compact - Less spacing, more content
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="shadow-md">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}