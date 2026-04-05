import { BLUE } from "../config.js";
import { FI, Btn } from "./ui.jsx";

export default function AddInstructorModal({
  addOpen,
  newName, setNewName,
  newRole, setNewRole,
  newAvail, setNewAvail,
  newAges, setNewAges,
  newBadge, setNewBadge,
  nameError, setNameError,
  addInst,
}) {
  if (!addOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Add new instructor"
      aria-modal="true"
      style={{
        background: "#f0f8ff",
        border: `2px solid ${BLUE}`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
      }}
    >
      <div style={{ fontWeight: "bold", color: BLUE, fontSize: 13, marginBottom: 10 }}>
        New Instructor
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <FI
          id="new-inst-name"
          label="Full Name"
          value={newName}
          onChange={(v) => { setNewName(v); if (nameError) setNameError(""); }}
          placeholder="Jane Smith"
        />
        <FI
          id="new-inst-role"
          label="Role"
          value={newRole}
          onChange={setNewRole}
          placeholder="Swim Instructor"
        />
      </div>
      {nameError && (
        <p style={{ color: "#c00", fontSize: 11, margin: "0 0 8px" }}>{nameError}</p>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <FI
          id="new-inst-avail"
          label="Availability"
          value={newAvail}
          onChange={setNewAvail}
          placeholder="e.g. Weekdays"
        />
        <FI
          id="new-inst-ages"
          label="Ages"
          value={newAges}
          onChange={setNewAges}
          placeholder="All ages"
        />
        <FI
          id="new-inst-badge"
          label="Badge"
          value={newBadge}
          onChange={setNewBadge}
          placeholder="Available"
        />
      </div>
      <Btn onClick={addInst} disabled={!newName.trim()} color={BLUE} full>
        Add to Roster
      </Btn>
    </div>
  );
}
