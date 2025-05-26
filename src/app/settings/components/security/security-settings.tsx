"use client"
import { useState } from 'react';
import { usePassword } from '@/hooks/usePassword';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 Key, Smartphone, Monitor, Lock } from "lucide-react"

export default function SecuritySettings() {
  const { isLoading, changePassword } = usePassword();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
    // Clear messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      setError('New passwords do not match');
      return;
    }

    try {
      const result = await changePassword(passwordData);
      setSuccess(result.message);
      // Reset form
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
       

        <div className="grid gap-8">
          {/* Password Section */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Key className="h-6 w-6" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
            </div>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="ml-2 text-red-800 dark:text-red-400 font-medium">{error}</span>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="ml-2 text-green-800 dark:text-green-400 font-medium">{success}</span>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old_password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</Label>
                    <Input
                      id="old_password"
                      type="password"
                      value={passwordData.old_password}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="h-12 border-2 border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="h-12 border-2 border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password_confirm" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                    <Input
                      id="new_password_confirm"
                      type="password"
                      value={passwordData.new_password_confirm}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="h-12 border-2 border-slate-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="h-12 px-8 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 dark:border-gray-600 dark:text-white"
                  onClick={() => {
                    setPasswordData({
                      old_password: '',
                      new_password: '',
                      new_password_confirm: ''
                    });
                    setError(null);
                    setSuccess(null);
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Smartphone className="h-6 w-6" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Add additional security to your account using two-factor authentication.
                </CardDescription>
              </CardHeader>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Authenticator App</h4>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app like Google Authenticator or Authy to generate verification codes.
                  </p>
                </div>
                <Switch className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-orange-600" />
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-gray-600" />

              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Text Message (SMS)</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive a code via SMS to verify your identity when signing in.
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-orange-600" /> 
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-gray-600" />

              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Backup Codes</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate backup codes to use when you don't have access to your other authentication methods.
                  </p>
                </div>
                <Button variant="outline" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg border-0">Generate Codes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Login Sessions */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Monitor className="h-6 w-6" />
                  Active Sessions
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Manage your active sessions on different devices.
                </CardDescription>
              </CardHeader>
            </div>
            
            <CardContent className="p-8 space-y-6">
              {[
                {
                  device: "MacBook Pro",
                  browser: "Chrome 112.0.5615",
                  ip: "192.168.1.1",
                  location: "San Francisco, CA",
                  lastActive: "Now",
                  current: true,
                },
                {
                  device: "iPhone 13",
                  browser: "Safari 16.4",
                  ip: "192.168.1.2",
                  location: "San Francisco, CA",
                  lastActive: "2 hours ago",
                  current: false,
                },
                {
                  device: "Windows PC",
                  browser: "Firefox 112.0.1",
                  ip: "192.168.1.3",
                  location: "New York, NY",
                  lastActive: "3 days ago",
                  current: false,
                },
              ].map((session, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium flex items-center gap-2">
                      {session.device} • {session.browser}
                      {session.current && (
                        <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full font-medium">Current</span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      IP: {session.ip} • {session.location}
                    </p>
                    <p className="text-sm text-muted-foreground">Last active: {session.lastActive}</p>
                  </div>
                  {!session.current && (
                    <Button variant="outline" size="sm" className="md:self-start border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400">
                      Revoke Access
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button variant="outline" className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/25 border-0">
                Log Out of All Other Devices
              </Button>
            </CardFooter>
          </Card>

          {/* Account Security */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Lock className="h-6 w-6" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Additional security settings for your account.
                </CardDescription>
              </CardHeader>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Login Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when your account is accessed from a new device or location.
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-orange-600" />
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-gray-600" />

              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-slate-200 dark:border-gray-700">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Require Password for Sensitive Actions</h4>
                  <p className="text-sm text-muted-foreground">
                    Require password confirmation for sensitive actions like changing payment methods.
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            Your security is our priority. Contact support if you notice any suspicious activity.
          </p>
        </div>
      </div>
    </div>
  )
}