export default function Nav({ page, setPage, user, onLogout }) {
  const displayName = user.displayName || user.email || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo">macros.</div>

        <div className="nav-tabs">
          {[
            ["dashboard", "Dashboard"],
            ["log", "Food Log"],
            ["goals", "My Goals"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`nav-tab ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="nav-user">
          <div className="nav-avatar">{initials}</div>
          <button className="btn-ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
