import Script from 'next/script';

export default function VTOTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Script 
        src="https://cdn.jsdelivr.net/npm/jeelizglassesvtowidget/dist/jeelizGlassesVTOWidget.js"
        strategy="beforeInteractive"
      />
      {children}
    </div>
  );
} 