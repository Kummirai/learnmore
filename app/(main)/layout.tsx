import Navbar from "@/components/Navbar"

export default function MainLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar/>
            <main id="main-content" className="flex-1">
                {children}
            </main>
        </>
    )
}
