import events from "../data/events.json";
import type { Event } from "../types/event";

const allEvents = events as Event[];

function formatRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return null;
  if (startDate && endDate) return `${startDate} → ${endDate}`;
  return startDate ?? endDate;
}

export default function EventsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">events</h1>
      {allEvents.length === 0 ? (
        <p>No events to show.</p>
      ) : (
        <ul className="space-y-6">
          {allEvents.map((event) => {
            const range = formatRange(event.startDate, event.endDate);
            return (
              <li key={event.title} className="border-b pb-4">
                <h2 className="text-lg font-medium">{event.title}</h2>
                {range && (
                  <p className="text-sm opacity-70 mt-1">{range}</p>
                )}
                <p className="mt-2">{event.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <a
                    href={event.source}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline"
                  >
                    source
                  </a>
                  {event.twitterPost && (
                    <a
                      href={event.twitterPost}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >
                      post
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
