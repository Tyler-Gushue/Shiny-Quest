import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="p-4 font-display">
        <Outlet />
      </main>
    </>
  );
}