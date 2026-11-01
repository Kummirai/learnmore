export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      {children}
    </main>
  );
}
