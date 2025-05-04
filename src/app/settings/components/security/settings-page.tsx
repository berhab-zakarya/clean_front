"use client"
import { useState } from "react"
import {
  Bell,
  ChevronDown,
  Home,
  Lock,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
  BarChart3,
  CreditCard,
  PieChart,
  Inbox,
  HelpCircle,
  Moon,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-border transition-all duration-300 hidden md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className={`font-semibold text-lg ${!sidebarOpen && "hidden"}`}>ShopDash</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
              <ChevronDown className={`h-4 w-4 transition-transform ${!sidebarOpen && "rotate-90"}`} />
            </Button>
          </div>

          <div className="flex-1 flex flex-col px-4 py-6 space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-4">Main Menu</p>
              <nav className="space-y-2">
                <Link href="/" className="lex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Home className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <PieChart className="h-5 w-5 mr-3" />
                  Insight
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 17H15M9 13H15M9 9H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Invoices
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Package className="h-5 w-5 mr-3" />
                  Products
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 9H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Reimburse
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Inbox className="h-5 w-5 mr-3" />
                  Inbox
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 mr-3" />
                  People & Teams
                </Link>
              </nav>
            </div>
  
            <div>
              <p className="text-sm font-medium text-gray-500 mb-4">Preferences</p>
              <nav className="space-y-2">
                <Link href="/settings" className="flex items-center px-3 py-2 text-[#1e3a8a] bg-blue-50 rounded-lg font-medium">
                <Settings className="h-5 w-5 mr-3" />
                Settings
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Center
                </Link>
                <div className="flex items-center px-3 py-2 text-gray-600">
                  <Moon className="h-5 w-5 mr-3" />
                  Dark Mode
                  <div className="ml-auto flex items-center">
                    <div className="w-10 h-5 bg-[#f97316] rounded-full p-1 flex items-center">
                      <div className="bg-white w-3.5 h-3.5 rounded-full shadow-sm transform translate-x-5"></div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="md:hidden">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-[300px] bg-muted/50" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">USER</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="p-6">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account profile information and email address.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback className="text-2xl">JD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" defaultValue="john.doe@example.com" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Company Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input id="company" defaultValue="Acme Inc." />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Job Title</Label>
                        <Input id="role" defaultValue="E-commerce Manager" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  {/* Password Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Update your password to keep your account secure.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Password</Button>
                    </CardFooter>
                  </Card>

                  {/* Two-Factor Authentication */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>
                        Add additional security to your account using two-factor authentication.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Authenticator App</h4>
                          <p className="text-sm text-muted-foreground">
                            Use an authenticator app to generate one-time codes.
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="font-medium">Text Message</h4>
                          <p className="text-sm text-muted-foreground">
                            Use your phone number to receive verification codes.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Login Sessions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active sessions on different devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          device: "MacBook Pro",
                          location: "San Francisco, CA",
                          lastActive: "Now",
                          current: true,
                        },
                        {
                          device: "iPhone 13",
                          location: "San Francisco, CA",
                          lastActive: "2 hours ago",
                          current: false,
                        },
                        {
                          device: "Windows PC",
                          location: "New York, NY",
                          lastActive: "3 days ago",
                          current: false,
                        },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium flex items-center gap-2">
                              {session.device}
                              {session.current && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Current
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {session.location} • Last active {session.lastActive}
                            </p>
                          </div>
                          {!session.current && (
                            <Button variant="outline" size="sm">
                              Log Out
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Log Out of All Devices
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
