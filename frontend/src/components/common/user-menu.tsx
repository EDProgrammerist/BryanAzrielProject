import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/use-auth";

export function UserMenu() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(function closeOnOutsideClick() {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return function cleanup() {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function handleSignOut() {
    await logout();
    nav("/login");
  }

  return (
    <div className="usermenu" ref={menuRef}>
      <button className="userbtn" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open}>
        <span className="avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
          </svg>
        </span>
        <span>{user?.name ?? "Admin"}</span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="menu" role="menu">
          <button role="menuitem" onClick={() => { setOpen(false); nav("/settings"); }}>Settings</button>
          <button role="menuitem" onClick={handleSignOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}