"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useUser } from '@/hooks/useUser';
import { useStore } from '@/hooks/useStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload,  CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "react-toastify";
import { Alert } from "@/components/common/feedback/Alert";

s
export default function PersonalAccount() {
  const { userData, loading, error: userError, isUpdating, updateProfile } = useUser();
  const { userStore, loading: storeLoading } = useStore();
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    phone_number: '',
    tax_identification: '',
    bio: ''
  });
  const [storeFormData, setStoreFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: ''
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(
    userData?.user?.profile?.profile_image_url || "/images/placeholder-user.jpg"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData?.user?.profile) {
      const { profile } = userData.user;
      setFormData({
        business_name: profile.business_name || '',
        business_address: profile.business_address || '',
        phone_number: profile.phone_number || '',
        tax_identification: profile.tax_identification || '',
        bio: profile.bio || ''
      });
      
      if (profile.profile_image_url) {
        setAvatarUrl(profile.profile_image_url);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userStore) {
      setStoreFormData({
        store_name: userStore.store_name || '',
        store_email: userStore.email || '',
        store_phone: userStore.phone || ''
      });
    }
  }, [userStore]);

  useEffect(() => {
    console.log('userData changed:', userData);
    console.log('formData:', formData);
  }, [userData, formData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDarkMode)
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setIsUploading(true)

      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)

      setTimeout(() => {
        setIsUploading(false)
      }, 1000)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteAvatar = () => {
    setAvatarUrl("/images/placeholder-user.jpg")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const success = await updateProfile({
        profile: {
          ...formData,
          is_verified: userData?.user?.profile?.is_verified || false,
          verification_document_url: userData?.user?.profile?.verification_document_url,
          profile_image_url: userData?.user?.profile?.profile_image_url
        }
      });

      if (success) {
        setSuccess('Profile updated successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleStoreUpdate = async () => {
    try {
      if (!userStore?.id) {
        toast.error('Store information not found');
        return;
      }

      // تحديث بيانات المتجر
      await storesAPI.updateStore(userStore.id, storeFormData);
      
      // إغلاق النافذة المنبثقة
      setIsProfileModalOpen(false);
      
      // عرض رسالة نجاح
      toast.success('Store information updated successfully');
      
      // تحديث البيانات المعروضة
      const updatedStore = await storesAPI.getStores();
      if (updatedStore) {
        setStoreFormData({
          store_name: updatedStore.store_name || '',
          store_email: updatedStore.email || '',
          store_phone: updatedStore.phone || ''
        });
      }
    } catch (error) {
      toast.error('Failed to update store information');
      console.error('Store update error:', error);
    }
  };

  console.log('Current formData:', formData);
  console.log('Current userData:', userData);

  if (loading || storeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading profile: {userError}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">Personal Account</h1>
          <p className="text-muted-foreground dark:text-gray-400">Manage your personal information and preferences</p>
        </div>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">Profile Information</CardTitle>
          <CardDescription className="dark:text-gray-400">Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert 
              color="error"
              icon={<AlertCircle className="h-5 w-5" />}
              title="Error"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              color="success"
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Success"
            >
              {success}
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-6 text-blue-600 dark:text-blue-400">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-muted dark:border-gray-600">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="text-2xl dark:bg-gray-700 dark:text-gray-300">JD</AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-6 w-6 text-white" />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
              <div className="flex gap-2 text-black dark:text-white">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeleteAvatar}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Delete
                </Button>
                <Button 
                  className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  size="sm" 
                  onClick={handleUploadClick}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center dark:text-gray-400">JPG or PNG. Max size 1MB.</p>
            </div>

            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name" className="dark:text-gray-300">Business Name</Label>
                    <Input 
                      id="business_name" 
                      value={formData.business_name}
                      onChange={handleChange}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                    <Input 
                      id="email" 
                      value={userData?.user?.email || ''}
                      type="email" 
                      disabled
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white opacity-70" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_address" className="dark:text-gray-300">Business Address</Label>
                  <Input 
                    id="business_address" 
                    value={formData.business_address}
                    onChange={handleChange}
                    placeholder="Enter business address" 
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="dark:text-gray-300">Phone Number</Label>
                    <Input 
                      id="phone_number" 
                      type="tel" 
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter phone number" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_identification" className="dark:text-gray-300">Tax ID</Label>
                    <Input 
                      id="tax_identification" 
                      value={formData.tax_identification}
                      onChange={handleChange}
                      placeholder="Enter tax ID" 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                  </div>
                </div>

                <Separator className="dark:bg-gray-700" />

                <div className="space-y-4">
                  <div className="space-y-2 text-blue-600 dark:text-blue-400">
                    <Label htmlFor="bio" className="dark:text-gray-300">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Write a short bio about yourself" 
                      className="min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-400">
                Shop Information {storeLoading && '(Loading...)'}
              </h3>
            </div>
            
            {userStore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Store Name</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {userStore.store_name || 'Not set'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Subdomain</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {userStore.subdomain || 'Not set'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Store Type</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {userStore.store_type || 'Not set'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Store Status</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${userStore.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    {userStore.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Deployment Status</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {userStore.deployment_status || 'Not set'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Created At</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                    {new Date(userStore.created_at).toLocaleDateString() || 'Not set'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
                {storeLoading ? (
                  <div className="animate-pulse">Loading store information...</div>
                ) : (
                  <div className="text-gray-500">No store information available</div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            Edit Store Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:w-[655px] h-[450px] max-h-[450px] p-5 dark:bg-gray-800 dark:text-white dark:border-gray-700" style={{ maxWidth: "655px", width: "655px", height: "450px" }}>
          <DialogHeader className="flex justify-between items-left">
            <DialogTitle className="text-lg font-medium text-blue-800 dark:text-blue-400">Edit Store Details</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            These details will be displayed on your store's website.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_name" className="text-sm font-normal dark:text-gray-300">Store Name</Label>
                  <Input 
                    id="store_name"
                    value={storeFormData.store_name}
                    onChange={(e) => setStoreFormData(prev => ({
                      ...prev,
                      store_name: e.target.value
                    }))}
                    className="border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Appears on your store website</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store_phone" className="text-sm font-normal dark:text-gray-300">Store Phone</Label>
                  <Input 
                    id="store_phone"
                    type="tel"
                    value={storeFormData.store_phone}
                    onChange={(e) => setStoreFormData(prev => ({
                      ...prev,
                      store_phone: e.target.value
                    }))}
                    className="border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store_email" className="text-sm font-normal dark:text-gray-300">Store Email</Label>
                <Input 
                  id="store_email"
                  type="email"
                  value={storeFormData.store_email}
                  onChange={(e) => setStoreFormData(prev => ({
                    ...prev,
                    store_email: e.target.value
                  }))}
                  className="border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receives messages about your store. For contact email address
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsProfileModalOpen(false)} 
              className="rounded-full px-6 py-2 text-black bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStoreUpdate}
              className="rounded-full px-6 py-2 text-white bg-blue-800 hover:bg-orange-600 dark:bg-blue-700 dark:hover:bg-orange-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}