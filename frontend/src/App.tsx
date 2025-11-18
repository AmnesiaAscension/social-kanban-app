import React, { useEffect, useState } from "react";
import { createTask, fetchTasks, type Task } from "./api";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const clients = ["Client A", "Client B", "Client C"];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(day: string, client: string) {
    await createTask({
      title: `Post for ${client} on ${day}`,
      client,
      dayOfWeek: day,
      status: "planned",
    });
    await loadTasks();
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://www.thesocialhivetx.com/_next/image?url=%2Flogo.png&w=128&q=75"
            alt="Hive Logo"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              The Social Hive • Content Scheduler
            </h1>
            <p className="text-xs text-amber-600 font-medium">
              Plan, track, and schedule content seamlessly
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {loading ? "Updating…" : `Tasks: ${tasks.length}`}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Column headers */}
        <div
          className="grid text-center font-medium text-sm text-slate-600"
          style={{
            gridTemplateColumns: `140px repeat(${clients.length}, minmax(200px, 1fr))`,
          }}
        >
          <div className="text-left text-slate-400 uppercase text-xs tracking-wide">
            Day
          </div>
          {clients.map((client) => (
            <div
              key={client}
              className="uppercase tracking-wide text-xs text-slate-500"
            >
              {client}
            </div>
          ))}
        </div>

        {/* Rows */}
        {days.map((day) => (
          <div
            key={day}
            className="grid border-b"
            style={{
              gridTemplateColumns: `140px repeat(${clients.length}, minmax(200px, 1fr))`,
            }}
          >
            {/* Day Label */}
            <div className="py-5 text-sm font-semibold text-slate-700">
              {day}
            </div>

            {/* Cells */}
            {clients.map((client) => {
              const count = tasks.filter(
                (t) => t.client === client && t.dayOfWeek === day
              ).length;

              return (
                <div key={client} className="p-4">
                  <div className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer">
                    <div className="text-xs text-slate-500">
                      Planned Posts:{" "}
                      <span className="font-semibold text-amber-600">
                        {count}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCreate(day, client)}
                      className="mt-3 w-full py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                    >
                      + Add Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
