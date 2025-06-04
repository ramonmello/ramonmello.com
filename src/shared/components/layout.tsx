import { Header } from "@/shared/components/header";
import { Footer } from "@/shared/components/footer";
export function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-rows-[20px_1fr_144px] items-center justify-items-center min-h-screen p-7 md:p-14 sm:p-14">
      <Header />
      <main className="flex flex-col gap-4 items-center sm:items-start">
        {children}
      </main>
      <Footer />
    </div>
  );
}
