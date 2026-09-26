import type {Metadata} from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
    title: {
        default: "Dashboard | Relate World",
        template: "%s | Relate Dashboard",
    },
    robots: {index: false, follow: false},
};

/**
 * All admin routes live in this group so they share one shell: the sidebar,
 * the role guard, and the queue badges. Pages must not render their own
 * Navbar or RequireAuth — the shell handles both.
 */
export default function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
    return <AdminShell>{children}</AdminShell>;
}
