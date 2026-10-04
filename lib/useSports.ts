"use client";

import { useEffect, useState } from "react";
import { fetchClientSports, type SportsData } from "@/lib/sports";

type ClientState = {
    sports: SportsData | null;
    loading: boolean;
    error: string | null;
};

const LOADING_STATE: ClientState = { sports: null, loading: true, error: null };

/** Set once a request succeeds, so a later mount paints without a loading tick. */
let clientState: ClientState | null = null;

/**
 * The catalogue for a client component, with loading and error spelled out.
 *
 * `sports` is null until the request lands (or fails), so callers render a
 * loading state, an explicit error, or the empty catalogue the API returned —
 * never a blank crash and never substitute data. Every consumer on the page
 * shares the one request started by `fetchClientSports()`.
 */
export function useSports(): {
    sports: SportsData | null;
    loading: boolean;
    error: string | null;
} {
    const [state, setState] = useState<ClientState | null>(clientState);

    useEffect(() => {
        let cancelled = false;
        fetchClientSports().then(
            (sports) => {
                if (cancelled) return;
                if (!clientState) {
                    clientState = { sports, loading: false, error: null };
                }
                // The same object every time, so an already-rendered consumer
                // re-renders only when there is something new to show.
                setState(clientState);
            },
            (err) => {
                if (cancelled) return;
                setState({
                    sports: null,
                    loading: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Could not load the squads.",
                });
            },
        );
        return () => {
            cancelled = true;
        };
    }, []);

    return state ?? LOADING_STATE;
}
