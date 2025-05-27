"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert } from "@/components/common/feedback/Alert";

export default function PersonalAccount() {
  const { userData, loading, error: userError, isUpdating, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    phone_number: '',
    tax_identification: '',
    bio: ''
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(
    userData?.user?.profile?.profile_image_url || "/images/placeholder-user.jpg"
  );
  const [isUploading, setIsUploading] = useState(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-gradient-to-br from-slate-50 to-blue-50">
        Error loading profile: {userError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
       

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Profile Information</CardTitle>
            <CardDescription className="text-blue-100">Update your photo and personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
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

            <div className="flex flex-col md:flex-row gap-6 text-slate-700">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">JD</AvatarFallback>
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
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDeleteAvatar}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    Delete
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="sm" 
                    onClick={handleUploadClick}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 text-center">JPG or PNG. Max size 1MB.</p>
              </div>

              <div className="flex-1 space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_name" className="text-slate-700 font-medium">Business Name</Label>
                      <Input 
                        id="business_name" 
                        value={formData.business_name}
                        onChange={handleChange}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                      <Input 
                        id="email" 
                        value={userData?.user?.email || ''}
                        type="email" 
                        disabled
                        className="bg-slate-100 border-slate-300 text-slate-600" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_address" className="text-slate-700 font-medium">Business Address</Label>
                    <Input 
                      id="business_address" 
                      value={formData.business_address}
                      onChange={handleChange}
                      placeholder="Enter business address" 
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone_number" className="text-slate-700 font-medium">Phone Number</Label>
                      <Input 
                        id="phone_number" 
                        type="tel" 
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Enter phone number" 
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax_identification" className="text-slate-700 font-medium">Tax ID</Label>
                      <Input 
                        id="tax_identification" 
                        value={formData.tax_identification}
                        onChange={handleChange}
                        placeholder="Enter tax ID" 
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                  <div className="space-y-4">
                    <div className="space-y-2 text-slate-700">
                      <Label htmlFor="bio" className="text-slate-700 font-medium">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Write a short bio about yourself" 
                        className="min-h-[120px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}