import { Outlet } from "react-router";
import Navbar from "./Navbar";
import StarBackground from "./StarBackground";

export default function AppLayout() {
  return (
    // Same starry dark background as the login page
    <div className="relative min-h-dvh bg-gray-950 text-white font-display overflow-hidden">
      <StarBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
