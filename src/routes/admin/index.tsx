import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="bg-white rounded-3xl p-4 lg:p-8 shadow-sm ring-1 ring-black/5 min-h-[400px] flex items-center justify-center">
      <h2 className="text-xl lg:text-2xl font-semibold text-ink/40">مرحباً بك في لوحة التحكم</h2>
    </div>
  );
}
