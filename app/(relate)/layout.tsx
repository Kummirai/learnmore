export default function RelateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main-content" className="flex-1">
      {children}
    </main>
  );
}
