'use client';

import { useStore } from '@/hooks/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Store } from '@/lib/types/store';
import { useRouter } from 'next/navigation';
import { Building2, Users, ExternalLink } from 'lucide-react';

export default function StoresPage() {
  const { stores, loading, error } = useStore();
  const router = useRouter();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading stores</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Building2 className="w-8 h-8" />
        Your Stores
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store: Store) => (
          <Card key={store.id} className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{store.store_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/${store.id}/developers`)}
                  className="hover:bg-primary/10"
                >
                  <Users className="w-5 h-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Subdomain: {store.subdomain}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={`${store.store_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Visit Store
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 