import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Supabase Todos Test Page</h1>
      {error && (
        <p style={{ color: "#ef4444" }}>
          Notice: {error.message} (Run the Supabase quickstart SQL to create the <code>todos</code> table if you wish to test it).
        </p>
      )}
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      <p>
        <a href="/" style={{ color: "#f59e0b" }}>← Back to Thadingyut Wishes</a>
      </p>
    </main>
  );
}
