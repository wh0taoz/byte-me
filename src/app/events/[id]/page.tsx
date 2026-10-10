import { Suspense } from "react";
import { EventDetailView } from "./detail";

export default function EventDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-line" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-line" />
          <div className="h-64 animate-pulse rounded-lg bg-line" />
        </div>
      }
    >
      <EventDetailView />
    </Suspense>
  );
}
