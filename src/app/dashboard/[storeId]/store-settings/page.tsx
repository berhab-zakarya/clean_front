'use client';

import { useStore } from '@/hooks/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Building2, Users, ExternalLink, Edit2, Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Sparkles, Star, Code, Megaphone, Briefcase } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Store } from '@/lib/types/store';

export default function StoreSettingsPage() {
  const params = useParams();
  const storeId = params?.storeId;
  const { stores, loading, error, updateStore, updateTenant } = useStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStore, setEditedStore] = useState<Store | null>(null);

  const currentStore = storeId && stores ? stores.find(store => store.id?.toString() === storeId.toString()) : null;

  const getFieldValue = (field: keyof Store, defaultValue: string = ''): string => {
    if (isEditing && editedStore) {
      return String(editedStore[field] || defaultValue);
    }
    return String(currentStore?.[field] || defaultValue);
  };

  // Default values for an eyewear store
  const defaultStoreValues = {
    store_name: 'Optical Vision',
    company_name: 'Optical Vision Eyewear',
    company_description: 'Your trusted destination for premium eyewear and optical solutions. We offer a wide selection of designer frames, prescription glasses, and sunglasses.',
    announcement_text: 'New Collection: Spring 2024 Designer Frames Available Now!',
    hero_title: 'Discover Your Perfect Vision',
    hero_description: 'Explore our exclusive collection of designer eyewear and experience the perfect blend of style and comfort.',
    email: 'contact@opticalvision.com',
    phone: '+1 (555) 123-4567',
    address: '123 Vision Street, Optical District, City, Country',
    whatsapp_number: '+1 (555) 123-4567',
    facebook_url: 'https://facebook.com/opticalvision',
    instagram_url: 'https://instagram.com/opticalvision',
    primary_color: '#1D1178',
    secondary_color: '#432EB5',
    description: 'Optical Vision is your premier destination for high-quality eyewear. We specialize in designer frames, prescription glasses, and sunglasses. Our expert opticians provide personalized service to help you find the perfect pair that matches your style and meets your vision needs.',
    store_type: 'Eyewear Retail',
    subdomain: 'optical-vision',
    store_url: 'https://optical-vision.com'
  };

  const defaultTenantValues = {
    company_name: "VisionCraft Eyewear",
    company_description: "Premium eyewear and optical solutions with expert eye care services",
    social_links: [
      {
        name: "facebook",
        url: "https://facebook.com/visioncrafteyewear"
      },
      {
        name: "instagram",
        url: "https://instagram.com/visioncrafteyewear"
      }
    ],
    announcement_text: "New designer frames collection now available! Free eye exam with purchase.",
    hero_title: "See the World Clearly",
    hero_description: "Discover our premium collection of designer frames, sunglasses, and professional eye care services.",
    email: "info@visioncrafteyewear.com",
    phone: "+12345678901",
    address: "456 Vision Boulevard, Optical District, NY 10001",
    whatsapp: "+12345678901"
  };

  const handleEdit = () => {
    if (currentStore) {
      setEditedStore({
        ...currentStore,
        company_name: defaultTenantValues.company_name,
        company_description: defaultTenantValues.company_description,
        announcement_text: defaultTenantValues.announcement_text,
        hero_title: defaultTenantValues.hero_title,
        hero_description: defaultTenantValues.hero_description,
        email: defaultTenantValues.email,
        phone: defaultTenantValues.phone,
        address: defaultTenantValues.address,
        whatsapp_number: defaultTenantValues.whatsapp,
        facebook_url: defaultTenantValues.social_links[0].url,
        instagram_url: defaultTenantValues.social_links[1].url
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editedStore || !currentStore) return;
    
    try {
      // Update store basic info - keep original values
      const updatedStore = await updateStore(currentStore.id, {
        store_name: currentStore.store_name,
        subdomain: currentStore.subdomain,
        store_type: currentStore.store_type
      });

      // Update tenant info with new values
      const updatedTenant = await updateTenant(currentStore.id, {
        constants: {
          company_name: editedStore.company_name || defaultTenantValues.company_name,
          company_description: editedStore.company_description || defaultTenantValues.company_description,
          announcement_text: editedStore.announcement_text || defaultTenantValues.announcement_text,
          hero_title: editedStore.hero_title || defaultTenantValues.hero_title,
          hero_description: editedStore.hero_description || defaultTenantValues.hero_description,
          email: editedStore.email || defaultTenantValues.email,
          phone: editedStore.phone || defaultTenantValues.phone,
          address: editedStore.address || defaultTenantValues.address,
          whatsapp: editedStore.whatsapp_number || defaultTenantValues.whatsapp,
          social_links: [
            { 
              name: 'facebook', 
              url: editedStore.facebook_url || defaultTenantValues.social_links[0].url
            },
            { 
              name: 'instagram', 
              url: editedStore.instagram_url || defaultTenantValues.social_links[1].url
            }
          ]
        }
      });

      if (updatedStore && updatedTenant) {
        setIsEditing(false);
        setEditedStore(null);
      }
    } catch (err) {
      console.error('Failed to update store:', err);
    }
  };

  const handleNavigateToDevelopers = () => {
    router.push(`/dashboard/${storeId}/developers`);
  };

  const handleInputChange = (field: keyof Store, value: string) => {
    setEditedStore((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  if (!storeId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#9F84FD] to-[#B49DFE] rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1D1178] mb-3">Invalid Store ID</p>
            <p className="text-[#5E43D8] text-lg">Please provide a valid store ID.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-2xl font-bold text-red-700 mb-3">Error loading store</p>
            <p className="text-red-600 text-lg">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto p-6">
          <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-[#1D1178] to-[#2D1D92] text-white rounded-t-2xl p-8">
              <Skeleton className="h-10 w-3/4 bg-white/20 rounded-xl" />
            </CardHeader>
            <CardContent className="p-8">
              <Skeleton className="h-6 w-full mb-6 rounded-xl" />
              <Skeleton className="h-6 w-2/3 rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#9F84FD] to-[#B49DFE] rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1D1178] mb-3">Store not found</p>
            <p className="text-[#5E43D8] text-lg">The requested store could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const store = isEditing ? editedStore : currentStore;

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#9F84FD] to-[#B49DFE] rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1D1178] mb-3">Store not found</p>
            <p className="text-[#5E43D8] text-lg">The requested store could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')]"></div>
        
        <div className="container mx-auto p-6 relative z-10">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1D1178] via-[#432EB5] to-[#2D1D92] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#1D1178]/25">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[#9F84FD] to-[#B49DFE] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1D1178] via-[#432EB5] to-[#2D1D92] bg-clip-text text-transparent">
                  Store Settings
                </h1>
                <p className="text-[#5E43D8]/70 text-base mt-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Manage your store configuration with style
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleNavigateToDevelopers}
                className="bg-gradient-to-r from-[#7C5CFC] to-[#9F84FD] hover:from-[#6B4EEB] hover:to-[#8B6EFD] text-white shadow-2xl shadow-[#7C5CFC]/30 hover:shadow-[#7C5CFC]/50 transition-all duration-300 transform hover:scale-105 px-6"
              >
                <Code className="w-5 h-5 mr-2" />
                Developers
              </Button>
              {isEditing ? (
                <>
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="outline" 
                    className="border-2 border-[#CEBEFE] text-[#432EB5] hover:bg-[#CEBEFE]/30 backdrop-blur-sm shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="bg-gradient-to-r from-[#9F84FD] to-[#B49DFE] hover:from-[#8B6EFD] hover:to-[#A086FE] text-white border-0 shadow-2xl shadow-[#9F84FD]/30 hover:shadow-[#9F84FD]/50 transition-all duration-300 transform hover:scale-105 px-6"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEdit} 
                  className="bg-gradient-to-r from-[#432EB5] to-[#5E43D8] hover:from-[#3A2699] hover:to-[#4F3AC4] text-white shadow-2xl shadow-[#432EB5]/30 hover:shadow-[#432EB5]/50 transition-all duration-300 transform hover:scale-105 px-6"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  Edit Store
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-fit grid-cols-5 bg-white/60 backdrop-blur-xl border-0 shadow-2xl shadow-[#1D1178]/10 rounded-2xl p-2">
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1D1178] data-[state=active]:to-[#2D1D92] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#1D1178]/30 rounded-xl transition-all duration-300 px-6 py-3 font-medium"
                >
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="company" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#432EB5] data-[state=active]:to-[#5E43D8] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#432EB5]/30 rounded-xl transition-all duration-300 px-6 py-3 font-medium"
                >
                  Company
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9F84FD] data-[state=active]:to-[#B49DFE] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#9F84FD]/30 rounded-xl transition-all duration-300 px-6 py-3 font-medium"
                >
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#432EB5] data-[state=active]:to-[#5E43D8] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#432EB5]/30 rounded-xl transition-all duration-300 px-6 py-3 font-medium"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7C5CFC] data-[state=active]:to-[#9F84FD] data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-[#7C5CFC]/30 rounded-xl transition-all duration-300 px-6 py-3 font-medium"
                >
                  Social
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#1D1178] to-[#2D1D92] text-white rounded-t-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')] opacity-30"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Building2 className="w-6 h-6" />
                    </div>
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Store Name</Label>
                      {isEditing ? (
                        <Input
                          value={getFieldValue('store_name')}
                          onChange={(e) => handleInputChange('store_name', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                        />
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <p className="text-[#2D1D92] font-semibold text-lg">{getFieldValue('store_name')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Subdomain</Label>
                      <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                        <p className="text-[#2D1D92] font-semibold text-lg">{getFieldValue('subdomain')}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Store Type</Label>
                      <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                        <p className="text-[#2D1D92] font-semibold text-lg">{getFieldValue('store_type')}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Status</Label>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={store.is_active ? "default" : "destructive"}
                          className={`${store.is_active ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" : ""} text-white px-4 py-2 text-sm font-medium rounded-xl shadow-lg`}
                        >
                          {store.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge 
                          variant={store.deployment_status === "failed" ? "destructive" : "default"}
                          className={`${store.deployment_status !== "failed" ? "bg-gradient-to-r from-[#432EB5] to-[#5E43D8] hover:from-[#3A2699] hover:to-[#4F3AC4]" : ""} text-white px-4 py-2 text-sm font-medium rounded-xl shadow-lg`}
                        >
                          {store.deployment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[#1D1178] font-semibold text-lg">Store URL</Label>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                      <Globe className="w-6 h-6 text-[#432EB5]" />
                      <a
                        href={getFieldValue('store_url')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#432EB5] hover:text-[#2D1D92] font-semibold text-lg hover:underline transition-all duration-200 flex-1"
                      >
                        {getFieldValue('store_url')}
                      </a>
                      <ExternalLink className="w-5 h-5 text-[#7C5CFC]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#432EB5] to-[#5E43D8] text-white rounded-t-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')] opacity-30"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Company Name</Label>
                      {isEditing ? (
                        <Input
                          value={getFieldValue('company_name')}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                          placeholder="Enter company name"
                        />
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('company_name')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Company Description</Label>
                      {isEditing ? (
                        <Textarea
                          value={getFieldValue('company_description')}
                          onChange={(e) => handleInputChange('company_description', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 min-h-[120px] rounded-xl text-lg"
                          placeholder="Enter company description"
                        />
                      ) : (
                        <div className="p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm min-h-[120px]">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('company_description')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[#1D1178] font-semibold text-lg flex items-center gap-2">
                      <Megaphone className="w-5 h-5" />
                      Announcement Text
                    </Label>
                    {isEditing ? (
                      <Input
                        value={getFieldValue('announcement_text')}
                        onChange={(e) => handleInputChange('announcement_text', e.target.value)}
                        className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                        placeholder="Enter announcement text"
                      />
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                        <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('announcement_text')}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Hero Title</Label>
                      {isEditing ? (
                        <Input
                          value={getFieldValue('hero_title')}
                          onChange={(e) => handleInputChange('hero_title', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                          placeholder="Enter hero title"
                        />
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('hero_title')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Hero Description</Label>
                      {isEditing ? (
                        <Textarea
                          value={getFieldValue('hero_description')}
                          onChange={(e) => handleInputChange('hero_description', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 min-h-[120px] rounded-xl text-lg"
                          placeholder="Enter hero description"
                        />
                      ) : (
                        <div className="p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm min-h-[120px]">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('hero_description')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#9F84FD] to-[#B49DFE] text-white rounded-t-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')] opacity-30"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <div className="w-6 h-6 bg-gradient-to-br from-white/60 to-white/40 rounded-full" />
                    </div>
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Primary Color</Label>
                      {isEditing ? (
                        <div className="flex items-center gap-4">
                          <Input
                            type="color"
                            value={getFieldValue('primary_color')}
                            onChange={(e) => handleInputChange('primary_color', e.target.value)}
                            className="w-20 h-16 p-2 border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] rounded-xl"
                          />
                          <Input
                            value={getFieldValue('primary_color')}
                            onChange={(e) => handleInputChange('primary_color', e.target.value)}
                            className="flex-1 border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-16 text-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <div
                            className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl"
                            style={{ backgroundColor: getFieldValue('primary_color') }}
                          />
                          <p className="text-[#2D1D92] font-semibold text-lg">{getFieldValue('primary_color')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg">Secondary Color</Label>
                      {isEditing ? (
                        <div className="flex items-center gap-4">
                          <Input
                            type="color"
                            value={getFieldValue('secondary_color')}
                            onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                            className="w-20 h-16 p-2 border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] rounded-xl"
                          />
                          <Input
                            value={getFieldValue('secondary_color')}
                            onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                            className="flex-1 border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-16 text-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <div
                            className="w-12 h-12 rounded-2xl border-4 border-white shadow-xl"
                            style={{ backgroundColor: getFieldValue('secondary_color') }}
                          />
                          <p className="text-[#2D1D92] font-semibold text-lg">{getFieldValue('secondary_color')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#432EB5] to-[#5E43D8] text-white rounded-t-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+')] opacity-30"></div>
                  <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={getFieldValue('email')}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('email')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[#1D1178] font-semibold text-lg flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Phone
                      </Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={getFieldValue('phone')}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 rounded-xl h-12 text-lg"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div className="p-4 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm">
                          <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('phone')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[#1D1178] font-semibold text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address
                    </Label>
                    {isEditing ? (
                      <Textarea
                        value={getFieldValue('address')}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 min-h-[120px] rounded-xl text-lg"
                        placeholder="Enter store address"
                      />
                    ) : (
                      <div className="p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm min-h-[120px]">
                        <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('address')}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[#1D1178] font-semibold text-lg">Description</Label>
                    {isEditing ? (
                      <Textarea
                        value={getFieldValue('description')}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="border-2 border-[#CEBEFE]/50 focus:border-[#432EB5] focus:ring-[#432EB5]/20 min-h-[140px] rounded-xl text-lg"
                        placeholder="Enter store description"
                      />
                    ) : (
                      <div className="p-6 bg-gradient-to-r from-[#CEBEFE]/30 to-[#E7DEFE]/30 rounded-xl border-2 border-[#CEBEFE]/30 backdrop-blur-sm min-h-[140px]">
                        <p className="text-[#2D1D92] font-medium text-lg">{getFieldValue('description')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#7C5CFC] to-[#9F84FD] text-white rounded-t-2xl p-8 relative overflow-hidden">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Social Media Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[#1D1178] font-medium flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        Facebook URL
                      </Label>
                      {isEditing ? (
                        <Input
                          type="url"
                          value={getFieldValue('facebook_url')}
                          onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                          className="border-[#7C5CFC]/30 focus:border-[#432EB5] focus:ring-[#432EB5]/20"
                          placeholder="https://facebook.com/yourstore"
                        />
                      ) : (
                        <div className="p-3 bg-gradient-to-r from-[#CEBEFE]/20 to-[#E7DEFE]/20 rounded-lg border border-[#7C5CFC]/20">
                          <p className="text-[#2D1D92]">{getFieldValue('facebook_url')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#1D1178] font-medium flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                        Instagram URL
                      </Label>
                      {isEditing ? (
                        <Input
                          type="url"
                          value={getFieldValue('instagram_url')}
                          onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                          className="border-[#7C5CFC]/30 focus:border-[#432EB5] focus:ring-[#432EB5]/20"
                          placeholder="https://instagram.com/yourstore"
                        />
                      ) : (
                        <div className="p-3 bg-gradient-to-r from-[#CEBEFE]/20 to-[#E7DEFE]/20 rounded-lg border border-[#7C5CFC]/20">
                          <p className="text-[#2D1D92]">{getFieldValue('instagram_url')}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 lg:col-span-2">
                      <Label className="text-[#1D1178] font-medium flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Number
                      </Label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={getFieldValue('whatsapp_number')}
                          onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                          className="border-[#7C5CFC]/30 focus:border-[#432EB5] focus:ring-[#432EB5]/20"
                          placeholder="Enter WhatsApp number"
                        />
                      ) : (
                        <div className="p-3 bg-gradient-to-r from-[#CEBEFE]/20 to-[#E7DEFE]/20 rounded-lg border border-[#7C5CFC]/20">
                          <p className="text-[#2D1D92]">{getFieldValue('whatsapp_number')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}