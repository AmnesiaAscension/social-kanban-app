const API_URL = import.meta.env.VITE_API_URL as string;

export type Task = {
  id: number;
  title: string;
  client: string;
  dayOfWeek: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
}

export async function createTask(input: {
  title: string;
  client: string;
  dayOfWeek: string;
  status?: string;
}): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
}
