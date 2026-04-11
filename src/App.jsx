import { useState, useRef } from "react";

// Data 

const COLUMNS = [
  { id: "applying",  label: "Applying Period", color: "#f97316" },
  { id: "screening", label: "Screening",       color: "#8b5cf6" },
  { id: "interview", label: "Interview",       color: "#3b82f6" },
  { id: "test",      label: "Test",            color: "#10b981" },
];

const INITIAL_CANDIDATES = [
  { id: 1, name: "Marlon Reynolds", date: "29 Oct, 2023", score: 3.5, referred: true, stage: "applying", hasPhoto: true},
  { id: 2, name: "Regina Hane", date: "29 Oct, 2023", score: 2, referred: false, stage: "applying", hasPhoto: false},
  { id: 3, name: "Curtis Baumbach", date: "29 Oct, 2023", score: 3, referred: true, stage: "applying", hasPhoto: false},
  { id: 4, name: "Jaime Anderson", date: "29 Oct, 2023", score: null, referred: false, stage: "applying", hasPhoto: true},
  { id: 5, name: "Kristi Sipes", date: "20 Oct, 2023", score: 3.5, referred: false, stage: "screening", hasPhoto: true},
  { id: 6, name: "Randy Dibbert", date: "18 Oct, 2023", score: 3.5, referred: false, stage: "screening", hasPhoto: true},
  { id: 7, name: "Jane Anderson", date: "18 Oct, 2023", score: null, referred: false, stage: "screening", hasPhoto: false},
  { id: 8, name: "Shelia Doyle", date: "13 Oct, 2023", score: 4.5, referred: true, stage: "screening", hasPhoto: false},
  { id: 9, name: "Cassandra Hartmann", date: "18 Oct, 2023", score: null, referred: false, stage: "screening", hasPhoto: false},
  { id: 10, name: "Cameron Dickens", date: "03 Sep, 2023", score: 4, referred: false, stage: "interview", hasPhoto: true},
  { id: 11, name: "Merie Vandervort", date: "09 Sep, 2023", score: 4, referred: false, stage: "interview", hasPhoto: true},
  { id: 12, name: "Jasmine Wiza", date: "10 Sep, 2023", score: null, referred: false, stage: "interview", hasPhoto: true},
  { id: 13, name: "Lola Kirlin", date: "03 Sep, 2023", score: 4.5, referred: true, stage: "test", hasPhoto: true},
  { id: 14, name: "Virgil Larkin", date: "03 Sep, 2023", score: null, referred: false, stage: "test", hasPhoto: true},
];

const AVATAR_PALETTES = [
  { bg: "#dbeafe", color: "#1d4ed8"},
  { bg: "#fce7f3", color: "#be185d"},
  { bg: "#dcfce7", color: "#15803d"},
  { bg: "#fef9c3", color: "#854d0e"},
  { bg: "#ede9fe", color: "#6d28d9"},
  { bg: "#ffedd5", color: "#c2410c"},
  { bg: "#f0fdf4", color: "#065f46"},
  { bg: "#fdf2f8", color: "#86198f"},
];

// Helpers

function getInitials(name){
  return name.split(" ").map((p) => p[0]).join("").slice(0,2).toUpperCase();
}

function getAvatarPalette(id){
  return AVATAR_PALETTES[id % AVATAR_PALETTES.length];
}

function StarRating({ score }){
  if(score === null) return null;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
      <span style={{ color: "#f59e0b", fontSize: 13 }}>★</span>
      {score} Overall
    </span>
  );
}

// Avatar

function Avatar({ candidate, size = 36}){
  const palette = getAvatarPalette(candidate.id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: palette.bg, color: palette.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 500, fontSize: size * 0.38,
    }}>
      {getInitials(candidate.name)}
    </div>
  );
}

// Candidate Card

function CandidateCard({ candidate, onOpen, onDragStart, onDragEnd}){
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
        border: `0.5px solid ${hovered ? "#cbd5e1" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: "14px",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 10}}>
        <Avatar candidate={candidate}/>
        <div style={{ flex: 1, minWidth: 0}}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1}}>
            Applied at {candidate.date}
          </div>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16,
            padding: "2px 4px", borderRadius: 4
          }}>
            ...
          </button>
      </div>
      <div style={{ paddingTop: 10, borderTop: "0.5px solid #f1f5f9", display: "flex", alignItems: "center",
        justifyContent: "space-between", minHeight: 24
      }}>
        {candidate.score !== null ? (
          <>
          <StarRating score = {candidate.score}/>
          {candidate.referred && (
            <span style={{ fontSize: 10, color: "#7c3aed", background: "#f5f3ff", padding: "2px 8px", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 4
            }}>
              👥 Referred
            </span>
          )}
          </>
        ) : (
          <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center",
            gap: 4
          }}>
            <span style={{ fontSize: 14}}>+</span> Add Assessment
          </span>
        )}
      </div>
    </div>
  );
}

// Kanban Column

function Column({ col, candidates, onOpen, onDrop, draggingId}){
  const [isOver, setIsOver] = useState(false);

  const colColors = {
    applying: { badge: "#fff7ed", text: "#c2410c", border: "#fed7aa"},
    screening: { badge: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe"},
    interview: {badge: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe"},
    test: { badge: "#f0fdf4", text: "#15803d", border: "#bbf7d0"},
  };
  const cc = colColors[col.id];

  return (
    <div
      style = {{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: 10}}
      onDragOver = {(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave = {() => setIsOver(false)}
      onDrop = {(e) => {e.preventDefault(); setIsOver(false); onDrop(col.id); }}
    >
        // Column header 
          <div style = {{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4}}>
          <div style = {{ display: "flex", alignItems: "center", gap: 8}}>
            <span style={{
              background: cc.badge, color: cc.text,
              border: '0.5px solid ${cc.border}',
              padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
            }}>
              {col.label}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8"}}>{candidates.length}</span>
          </div>
          <span style={{ fontSize: 11, color: cc.text, cursor: "pointer"}}>Detail ›</span>
        </div>

        // Drop zone highlight
        {isOver && draggingId && (
          <div style={{
            height: 4, borderRadius: 4,
            background: col.color,
            marginBottom: 2,
            transition: "opacity 0.15s",
          }} />
        )}

        // Cards
        {candidates.length === 0 ? (
          <div style={{
            minHeight: 80, border: '1.5px dashed ${isOver ? col.color : "#e2e8f0"}',
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: isOver ? col.color: "#cbd5e1",
            background: isOver ? `${col.color}10` : "transparent",
            transition: "all 0.15s"
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
  );
}

// Detail Model

function Model({ candidate, onClose, onMove }){
  if(!candidate) return null;
  const currentCol = COLUMNS.find((c) => c.id === candidate.length);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.45",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380,
        border: "0.5px solid #e2e8f0", position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none",
            fontSize: 18, color: "#94a3b8", cursor: "pointer"
          }} >
            x
          </button>

          <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 18}}>
            <Avatar candidate={candidate} size={48}/>
            <div>
              <div style = {{ fontSize: 16, fontWeight: 500, color: "#0f172a"}}>
                {candidate.name}
              </div>
              <div style = {{fontSize: 12, color: "#94a3b8", marginTop: 2}}>Applied at {candidate.date}</div>
            </div>
          </div>

           <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <InfoRow label="Current stage">
            <span style={{
              background: "#f8fafc", border: "0.5px solid #e2e8f0",
              padding: "3px 10px", borderRadius: 8, fontSize: 13, color: "#334155",
            }}>
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
        </div>

        <div style = {{ borderTop: "0.5px solid #f1f5f9", paddingTop: 16}}>
          <div style = {{ fontSize: 12, color: "#94a3b8", marginBottom: 10}} > Move to Stage</div>
          <div style = {{ display: "flex", flexWrap: "wrap", gap: 8}} >
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                onClick={() => {onMove(candidate.id, col.id); onClose(); }}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12,
                  border: candidate.stage === col.id ? `1.5px solid ${col.color}` : "0.5px solid #e2e8f0",
                  background: candidate.stage === col.id ? `${col.color}15` : "#f8fafc",
                  color: candidate.stage === col.id ? col.color : "#475569",
                  cursor: "pointer", fontWeight: candidate.stage === col.id ? 500 : 400,
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

function InfoRow({ label, children}){
  return (
    <div style = {{ display: "flex", alignItems: "center", justifyContent: "space-between"}} >
      <span style={{ fontSize: 13, color: "#64748b"}}>{label}</span>
      {children}
    </div>
  );
}

// Top Bar

function TopBar(){
  return (
    <div style={{ background: "#1a1f2e", display: "flex", alignItems: "center", gap: 20, padding: "0 20px",
      height: 52, flexShrink: 0
    }}>
      <div style = {{ display: "flex", alignItems: "center", gap: 8}}>
        <div style={{ width: 28, height: 28, background: "#f97316", borderRadius: 6, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
          color: "#fff"
        }}>T</div>
             <span style={{ color: "#fff", fontWeight: 500, fontSize: 16}}>tiimi</span>
             <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: 14, marginLeft: 8}}>
              Recruitment
             </span>
      </div>
      <div style={{ display: "flex", gap: 4, marginLeft: "auto"}}>
        {[
          { label: "Jobs", badge: "8"},
          { label: "Candidate", badge: "551"},
          { label: "Career Site", badge: null},
        ].map(({ label, badge}, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            background: i === 0 ? "rgba(255,255,255,0.14)" : "transparent",
            color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13,
          }}>
            {label}
            {badge && (
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>
                {badge}
              </span>
            )}
            </div>
        ))}
      </div>
    </div>
  );
}

// Page Header

const PAGE_TABS = ["Candidates", "Job Info", "Calendar", "Score Card", "Activity", "Application Form", "Automation"];

function PageHeader({ activeTab, setActiveTab}){
  return (
    <div style = {{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "14px 20px 0", flexShrink: 0}}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10}}>
        <span style = {{ fontSize: 20, fontWeight: 500, color: "#0f172a"}}>
          Research and Development Officer
        </span>
        <span style = {{ background: "#dcfce7", color: "#15803d", fontSize: 11, padding: "2px 10px",
          borderRadius: 12, fontWeight: 500
        }}>● Open</span>
        <span style={{ fontSize: 12, color: "#94a3b8"}}>
          Researcher · Onsite · Created by Bagus Fikri
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8"}}>1 of 8</span>
      </div>
      <div style={{ display: "flex", gap: 2, overflowX: "auto"}}>
        {PAGE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 14px", fontSize: 13, background: "none", border: "none",
              borderBottom: activeTab === tab ? "2px solid #0f172a" : "2px solid transparent",
              color: activeTab === tab ? "#0f172a" : "#64748b",
              fontWeight: activeTab === tab ? 500 : 400,
              cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
            }}
            >
              {tab}
              {tab === "Automation" && (
                <span style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 10,
                  padding: "1px 6px", borderRadius: 10
                }}>5
                </span>
              )}
            </button>
        ))}
      </div>
    </div>
  );
}

// Toolbar

function Toolbar({ search, setSearch}){
  return (
    <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", display: "flex",
      alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 20px", flexShrink: 0
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc",
        border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "6px 12px", width: 200
      }}>
        <span style={{ fontSize: 13, color: "#94a3b8"}}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#0f172a", width: "100%"}}
          />
      </div>
      {["📅 Date Range", "⭐ Score Range", "⚙ Advance Filter"].map((f) => (
        <button key={f} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "0.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#64748b", cursor: "pointer", background: "#fff" }}>
          {f} ⌄
        </button>
      ))}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "0.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, color: "#64748b", cursor: "pointer", background: "#fff" }}>
          👥 Refer People
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "0.5px solid #cbd5e1", borderRadius: 8, fontSize: 12, color: "#0f172a", cursor: "pointer", background: "#fff", fontWeight: 500 }}>
          ⬛ Kanban ⌄
        </button>
      </div>
    </div>
  );
}