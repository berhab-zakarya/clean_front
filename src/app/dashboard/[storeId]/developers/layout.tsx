'use client';

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-full">
      {children}
    </main>
  );
} 