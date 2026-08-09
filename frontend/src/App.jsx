import { useState, useRef, useEffect } from "react";

// Data

const COLUMNS = [
  { id: "applying",  label: "Applying Period", color: "#f97316" },
  { id: "screening", label: "Screening",       color: "#8b5cf6" },
  { id: "interview", label: "Interview",       color: "#3b82f6" },
  { id: "test",      label: "Test",            color: "#10b981" },
];

const INITIAL_CANDIDATES = [
  { id: 1,  name: "Marlon Reynolds",    date: "29 Oct, 2023", score: 3.5, referred: true,  stage: "applying",  pi: 0 },
  { id: 2,  name: "Regina Hane",        date: "29 Oct, 2023", score: 2,   referred: false, stage: "applying",  pi: 1 },
  { id: 3,  name: "Curtis Baumbach",    date: "29 Oct, 2023", score: 3,   referred: true,  stage: "applying",  pi: 2 },
  { id: 4,  name: "Jaime Anderson",     date: "29 Oct, 2023", score: null, referred: false, stage: "applying", pi: 4 },
  { id: 5,  name: "Kristi Sipes",       date: "20 Oct, 2023", score: 3.5, referred: false, stage: "screening", pi: 5 },
  { id: 6,  name: "Randy Dibbert",      date: "18 Oct, 2023", score: 3.5, referred: false, stage: "screening", pi: 7 },
  { id: 7,  name: "Jane Anderson",      date: "18 Oct, 2023", score: null, referred: false, stage: "screening", pi: 3 },
  { id: 8,  name: "Shelia Doyle",       date: "13 Oct, 2023", score: 4.5, referred: true,  stage: "screening", pi: 6 },
  { id: 9,  name: "Cassandra Hartmann", date: "18 Oct, 2023", score: null, referred: false, stage: "screening", pi: 8 % 8 },
  { id: 10, name: "Cameron Dickens",    date: "03 Sep, 2023", score: 4,   referred: false, stage: "interview", pi: 0 },
  { id: 11, name: "Merie Vandervort",   date: "09 Sep, 2023", score: 4,   referred: false, stage: "interview", pi: 1 },
  { id: 12, name: "Jasmine Wiza",       date: "10 Sep, 2023", score: null, referred: false, stage: "interview", pi: 2 },
  { id: 13, name: "Lola Kirlin",        date: "03 Sep, 2023", score: 4.5, referred: true,  stage: "test",      pi: 3 },
  { id: 14, name: "Virgil Larkin",      date: "03 Sep, 2023", score: null, referred: false, stage: "test",      pi: 5 },
];

const AVATAR_PALETTES = [
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#fce7f3", color: "#be185d" },
  { bg: "#dcfce7", color: "#15803d" },
  { bg: "#fef9c3", color: "#854d0e" },
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#ffedd5", color: "#c2410c" },
  { bg: "#f0fdf4", color: "#065f46" },
  { bg: "#fdf2f8", color: "#86198f" },
];

const COL_STYLES = {
  applying:  { badge: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  screening: { badge: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  interview: { badge: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  test:      { badge: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
};

const PAGE_TABS = ["Candidates", "Job Info", "Calendar", "Score Card", "Activity", "Application Form", "Automation"];

// Helpers

function getInitials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function getPalette(pi) {
  return AVATAR_PALETTES[pi % AVATAR_PALETTES.length];
}

// Avatar

function Avatar({ candidate, size = 38 }) {
  const p = getPalette(candidate.pi);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: p.bg, color: p.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.36,
    }}>
      {getInitials(candidate.name)}
    </div>
  );
}

// Star Rating

function StarRating({ score }) {
  if (score === null) return null;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
      <span style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
      {score} Overall
    </span>
  );
}

// Info Row

function InfoRow({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid #f1f5f9" }}>
      <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
      {children}
    </div>
  );
}

// Candidate Card

function CandidateCard({ candidate, onOpen, onDragStart, onDragEnd }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(candidate.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${hovered ? "#cbd5e1" : "#eaecf0"}`,
        borderRadius: 12,
        padding: "14px",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Avatar candidate={candidate} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
            Applied at {candidate.date}
          </div>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{ background: "none", border: "none", color: "#c8cfd9", cursor: "pointer", fontSize: 16, padding: "2px 4px", borderRadius: 4, lineHeight: 1 }}
        >
          ···
        </button>
      </div>

      {/* Footer */}
      <div style={{ paddingTop: 10, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 26 }}>
        {candidate.score !== null ? (
          <>
            <StarRating score={candidate.score} />
            {candidate.referred && (
              <span style={{ fontSize: 10, color: "#7c3aed", background: "#f5f3ff", padding: "3px 8px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                👥 Referred
              </span>
            )}
          </>
        ) : (
          <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}
            onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: 14 }}>+</span> Add Assessment
          </span>
        )}
      </div>
    </div>
  );
}

// Kanban Column

function Column({ col, candidates, onOpen, onDrop, draggingId }) {
  const [isOver, setIsOver] = useState(false);
  const cs = COL_STYLES[col.id];

  return (
    <div
      style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(col.id); }}
    >
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: cs.badge,
            color: cs.text,
            border: `1px solid ${cs.border}`,
            padding: "4px 12px",
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {col.label}
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>{candidates.length}</span>
        </div>
        <span style={{ fontSize: 11, color: cs.text, cursor: "pointer" }}>Detail ›</span>
      </div>

      {/* Drop highlight bar */}
      {isOver && draggingId && (
        <div style={{ height: 4, borderRadius: 4, background: col.color, marginBottom: 2, transition: "opacity 0.15s" }} />
      )}

      {/* Cards or empty drop zone */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 8, paddingRight: 2 }}>
        {candidates.length === 0 ? (
          <div style={{
            minHeight: 80,
            border: `2px dashed ${isOver ? col.color : "#e2e8f0"}`,
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12,
            color: isOver ? col.color : "#cbd5e1",
            background: isOver ? `${col.color}10` : "transparent",
            transition: "all 0.15s",
          }}>
            Drop here
          </div>
        ) : (
          candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Modal

function Modal({ candidate, onClose, onMove }) {
  if (!candidate) return null;
  const currentCol = COLUMNS.find((c) => c.id === candidate.stage);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 300, padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400,
        border: "0.5px solid #e2e8f0", position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: "2px 6px", borderRadius: 4 }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <Avatar candidate={candidate} size={52} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#0f172a" }}>{candidate.name}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Applied at {candidate.date}</div>
          </div>
        </div>

        {/* Info rows */}
        <InfoRow label="Current stage">
          <span style={{ background: "#f8fafc", border: "0.5px solid #e2e8f0", padding: "3px 10px", borderRadius: 8, fontSize: 13, color: "#334155" }}>
            {currentCol?.label}
          </span>
        </InfoRow>
        <InfoRow label="Score">
          {candidate.score !== null
            ? <span style={{ fontSize: 14, color: "#0f172a" }}><span style={{ color: "#f59e0b" }}>★</span> {candidate.score} / 5.0</span>
            : <span style={{ fontSize: 13, color: "#94a3b8" }}>Not scored yet</span>
          }
        </InfoRow>
        <InfoRow label="Referred">
          <span style={{ fontSize: 13, color: candidate.referred ? "#7c3aed" : "#94a3b8" }}>
            {candidate.referred ? "✓ Yes" : "No"}
          </span>
        </InfoRow>

        {/* Move to stage */}
        <div style={{ borderTop: "0.5px solid #f1f5f9", paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>Move to stage</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                onClick={() => { onMove(candidate.id, col.id); onClose(); }}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12,
                  border: candidate.stage === col.id ? `1.5px solid ${col.color}` : "0.5px solid #e2e8f0",
                  background: candidate.stage === col.id ? `${col.color}18` : "#f8fafc",
                  color: candidate.stage === col.id ? col.color : "#475569",
                  cursor: "pointer",
                  fontWeight: candidate.stage === col.id ? 600 : 400,
                  transition: "all 0.12s",
                }}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Top Bar

function TopBar() {
  return (
    <div style={{ background: "#1c2333", display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 50, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, background: "#f97316", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>T</div>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>tiimi</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, marginLeft: 4 }}>Recruitment</span>
      </div>

      <div style={{ display: "flex", gap: 4, margin: "0 auto" }}>
        {[{ label: "Jobs", badge: "8", active: true }, { label: "Candidate", badge: "551", active: false }, { label: "Career Site", badge: null, active: false }].map(({ label, badge, active }) => (
          <button key={label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.5)", background: active ? "rgba(255,255,255,0.12)" : "transparent", border: "none", cursor: "pointer" }}>
            {label}
            {badge && <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>{badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ width: 30, height: 30, background: "#f59e0b", borderRadius: 8, border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
        <button style={{ width: 30, height: 30, background: "transparent", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 15, cursor: "pointer" }}>🔍</button>
        <button style={{ width: 30, height: 30, background: "transparent", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 15, cursor: "pointer" }}>🔔</button>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#4f6fbe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", cursor: "pointer" }}>FIK</div>
      </div>
    </div>
  );
}

// Left Sidebar

function LeftSidebar() {
  const icons = [
    { icon: "🏠", active: false },
    { icon: "📅", active: false },
    { icon: "📋", active: false },
    { icon: "👤", active: true  },
    { icon: "⚙",  active: false },
    { icon: "📊", active: false },
    { icon: "🗂",  active: false },
  ];
  return (
    <aside style={{ width: 52, background: "#1c2333", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 4, flexShrink: 0 }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "#334166", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", marginBottom: 8 }}>FIK</div>
      <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
      {icons.map(({ icon, active }, i) => (
        <div key={i} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", background: active ? "rgba(255,255,255,0.11)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.35)" }}>
          {icon}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>❓</div>
    </aside>
  );
}

// Right Sidebar

function RightSidebar() {
  return (
    <aside style={{ width: 44, background: "#fff", borderLeft: "1px solid #e8ecf0", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 6, flexShrink: 0 }}>
      {["📋", "📄", "🗂", "🔵", "💬"].map((icon, i) => (
        <div key={i} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#94a3b8", cursor: "pointer" }}>
          {icon}
        </div>
      ))}
    </aside>
  );
}

// Page Header

function PageHeader({ activeTab, setActiveTab }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "0 20px", flexShrink: 0 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0 8px", flexWrap: "wrap" }}>
        <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#64748b", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <span style={{ fontSize: 19, fontWeight: 600, color: "#0f172a" }}>Research and Development Officer</span>
        <span style={{ color: "#94a3b8", fontSize: 14, cursor: "pointer" }}>⌄</span>
        <div style={{ display: "flex", gap: 3 }}>
          <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#64748b", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#64748b", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>1 of 8</span>
        <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#64748b", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>···</button>
        <button style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          <span>↗</span> Share &amp; Promote
        </button>
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          Open
        </span>
        <span style={{ color: "#e2e8f0" }}>·</span>
        <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>🔬 Researcher</span>
        <span style={{ color: "#e2e8f0" }}>·</span>
        <span style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>🏢 Onsite</span>
        <span style={{ color: "#e2e8f0" }}>·</span>
        <span style={{ fontSize: 12, color: "#64748b" }}>Created by <span style={{ color: "#3b82f6", fontWeight: 500, cursor: "pointer" }}>Bagus Fikri</span></span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto" }}>
        {PAGE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 14px", fontSize: 13, background: "none", border: "none",
              borderBottom: activeTab === tab ? "2px solid #0f172a" : "2px solid transparent",
              color: activeTab === tab ? "#0f172a" : "#64748b",
              fontWeight: activeTab === tab ? 500 : 400,
              cursor: "pointer", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            {tab}
            {tab === "Automation" && (
              <span style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 10, padding: "1px 6px", borderRadius: 10 }}>5</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Toolbar

function Toolbar({ search, setSearch }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 20px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", width: 200 }}>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", width: "100%" }}
        />
      </div>
      {["📅 Date Range", "⭐ Score Range", "⚙ Advance Filter"].map((f) => (
        <button key={f} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#475569", cursor: "pointer", background: "#fff" }}>
          {f} ⌄
        </button>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#475569", cursor: "pointer", background: "#fff" }}>
          👥 Refer People
        </button>
        <button style={{ width: 32, height: 32, border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", cursor: "pointer", background: "#fff", fontSize: 14 }}>⚙</button>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 12, color: "#0f172a", cursor: "pointer", background: "#fff", fontWeight: 500 }}>
          ⬛ Kanban ⌄
        </button>
      </div>
    </div>
  );
}

// App Root

export default function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab]   = useState("Candidates");
  const [search, setSearch]         = useState("");
  const [modalId, setModalId]       = useState(null);
  const draggingId                  = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch candidates");
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function moveCandidate(id, newStage) {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c)));

    fetch(`http://localhost:5000/api/candidates/${id}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    }).catch((err) => console.error("Failed to update stage on server:", err));
  }

  function handleDrop(colId) {
    if (draggingId.current !== null) {
      moveCandidate(draggingId.current, colId);
      draggingId.current = null;
    }
  }

  const modalCandidate = candidates.find((c) => c.id === modalId) || null;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#64748b" }}>
        Loading candidates...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#dc2626" }}>
        Error: {error}. Make sure the backend server is running on port 5000.
      </div>
    );
  }

  if (typeof document !== "undefined" && !document.getElementById("rkb-reset")) {
    const s = document.createElement("style");
    s.id = "rkb-reset";
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
    `;
    document.head.appendChild(s);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f4f5f7", overflow: "hidden" }}>
      <TopBar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <PageHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <Toolbar search={search} setSearch={setSearch} />

          {/* Board */}
          <div style={{ display: "flex", gap: 14, padding: "16px 20px", overflow: "hidden", flex: 1 }}>
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                candidates={filteredCandidates.filter((c) => c.stage === col.id)}
                onOpen={setModalId}
                onDrop={handleDrop}
                draggingId={draggingId.current}
              />
            ))}
          </div>
        </div>

        <RightSidebar />
      </div>

      {modalCandidate && (
        <Modal
          candidate={modalCandidate}
          onClose={() => setModalId(null)}
          onMove={moveCandidate}
        />
      )}
    </div>
  );
}