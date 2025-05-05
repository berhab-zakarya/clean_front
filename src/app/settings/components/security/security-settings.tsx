"use client"
import { useState } from 'react';
import { usePassword } from '@/hooks/usePassword';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">Security</h1>
        <p className="text-muted-foreground">Manage your account security and authentication methods</p>
      </div>

      {/* Password Section */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{error}</span>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-500 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="ml-2">{success}</span>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={handleChange}
                placeholder="Enter current password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password_confirm">Confirm New Password</Label>
              <Input
                id="new_password_confirm"
                type="password"
                value={passwordData.new_password_confirm}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="bg-orange-500 text-white hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 tracking-tight dark:text-blue-400">Two-Factor Authentication</CardTitle>
          <CardDescription>Add additional security to your account using two-factor authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between ">
            <div className="space-y-0.5">
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy to generate verification codes.
              </p>
            </div>
            <Switch className="data-[state=checked]:bg-orange-500" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Text Message (SMS)</h4>
              <p className="text-sm text-muted-foreground">
                Receive a code via SMS to verify your identity when signing in.
              </p>
            </div>
            <Switch defaultChecked  className="data-[state=checked]:bg-orange-500" /> 
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Backup Codes</h4>
              <p className="text-sm text-muted-foreground">
                Generate backup codes to use when you don't have access to your other authentication methods.
              </p>
            </div>
            <Button variant="outline" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">Generate Codes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Sessions */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 tracking-tight dark:text-blue-400">Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions on different devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg"
            >
              <div className="space-y-1">
                <h4 className="font-medium flex items-center gap-2">
                  {session.device} • {session.browser}
                  {session.current && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  IP: {session.ip} • {session.location}
                </p>
                <p className="text-sm text-muted-foreground">Last active: {session.lastActive}</p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" className="md:self-start dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  Revoke Access
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-white bg-red-800 hover:bg-red-600">
            Log Out of All Other Devices
          </Button>
        </CardFooter>
      </Card>

      {/* Account Security */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="">Account Security</CardTitle>
          <CardDescription>Additional security settings for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Login Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive email notifications when your account is accessed from a new device or location.
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Require Password for Sensitive Actions</h4>
              <p className="text-sm text-muted-foreground">
                Require password confirmation for sensitive actions like changing payment methods.
              </p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
