export default function EducationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main-content" className="flex-1">
      {children}
    </main>
  );
}
