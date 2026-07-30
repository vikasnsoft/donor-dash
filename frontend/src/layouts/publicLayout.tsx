import { PublicFooter } from "@/components/publicFooter";
import { PublicHeader } from "@/components/publicHeader";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
