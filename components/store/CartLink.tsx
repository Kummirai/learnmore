"use client";

import Link from "next/link";
import {LuShoppingBag} from "react-icons/lu";
import {useCartCount} from "@/lib/cart";

/** Cart button with a live item badge, shared by the navbar and store pages. */
export default function CartLink({
    overlay = false,
    className = "",
}: {
    overlay?: boolean;
    className?: string;
}) {
    const count = useCartCount();

    return (
        <Link
            href="/store/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className={`relative grid size-10 place-items-center rounded-full transition-colors ${
                overlay
                    ? "text-white hover:bg-white/10"
                    : "text-navy hover:bg-alice-blue"
            } ${className}`}
        >
            <LuShoppingBag className="text-xl" aria-hidden />
            {count > 0 && (
                <span
                    className={`absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-blue px-1 text-[9px] font-bold text-white ring-2 ${
                        overlay ? "ring-navy" : "ring-white"
                    }`}
                >
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </Link>
    );
}
