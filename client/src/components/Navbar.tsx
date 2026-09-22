import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/hunts">Hunts</NavLink>
      <NavLink to="/friends">Friends</NavLink>
    </nav>
  );
}