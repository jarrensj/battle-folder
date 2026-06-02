"use client";

import { useMemo, useState } from "react";
import events from "../data/events.json";
import type { Event } from "../types/event";

const allEvents = events as Event[];

type SortKey = "endDateAsc" | "endDateDesc" | "startDateDesc" | "startDateAsc";
type StatusFilter = "all" | "ongoing" | "upcoming" | "past";

const SORT_LABEL: Record<SortKey, string> = {
  endDateAsc: "ending soonest",
  endDateDesc: "ending latest",
  startDateDesc: "most recent start",
  startDateAsc: "oldest start",
};

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "all",
  ongoing: "ongoing",
  upcoming: "upcoming",
  past: "past",
};

function formatRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return null;
  if (startDate && endDate) return `${startDate} → ${endDate}`;
  return startDate ?? endDate;
}

function eventStatus(event: Event, todayIso: string): StatusFilter {
  const start = event.startDate;
  const end = event.endDate;
  if (end && end < todayIso) return "past";
  if (start && start > todayIso) return "upcoming";
  if (start || end) return "ongoing";
  return "ongoing";
}

function compareDates(a: string | undefined, b: string | undefined, dir: 1 | -1) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a < b ? -dir : a > b ? dir : 0;
}

export default function EventsPage() {
  const [sort, setSort] = useState<SortKey>("endDateAsc");
  const [status, setStatus] = useState<StatusFilter>("all");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const visibleEvents = useMemo(() => {
    const filtered =
      status === "all"
        ? allEvents
        : allEvents.filter((e) => eventStatus(e, today) === status);
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "endDateAsc":
          return compareDates(a.endDate, b.endDate, 1);
        case "endDateDesc":
          return compareDates(a.endDate, b.endDate, -1);
        case "startDateAsc":
          return compareDates(a.startDate, b.startDate, 1);
        case "startDateDesc":
          return compareDates(a.startDate, b.startDate, -1);
      }
    });
  }, [sort, status, today]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">events</h1>

      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <label className="flex items-center gap-2">
          <span className="opacity-70">sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border rounded px-2 py-1 bg-transparent"
          >
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="opacity-70">show:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="border rounded px-2 py-1 bg-transparent"
          >
            {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleEvents.length === 0 ? (
        <p>No events match the current filters.</p>
      ) : (
        <ul className="space-y-6">
          {visibleEvents.map((event) => {
            const range = formatRange(event.startDate, event.endDate);
            return (
              <li key={event.title} className="border-b pb-4">
                <h2 className="text-lg font-medium">{event.title}</h2>
                {range && <p className="text-sm opacity-70 mt-1">{range}</p>}
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
