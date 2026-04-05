import { useState } from "react";
import { SEED, COLORS } from "../config.js";
import { initials } from "../utils/email.js";

/**
 * Builds the initial instructor state map from SEED data.
 * @returns {Object} Map of instructor ID → instructor state object
 */
export function buildInitialInsts() {
  const result = {};
  for (const s of SEED) {
    result[s.id] = {
      sel: s.id === "bobby" || s.id === "riley_n",
      name: s.name,
      role: s.role,
      avail: s.av,
      badge: s.badge,
      ages: s.ages,
      pro: s.pro,
      col: s.col,
      ini: s.ini,
      bb: s.bb,
      bc: s.bc,
      dark: s.dark,
      custom: false,
    };
  }
  return result;
}

/**
 * Custom hook for managing the instructor roster state and actions.
 * @returns {Object} Instructor state, setters, and action handlers
 */
export function useInstructors() {
  const [instOrder, setInstOrder] = useState(SEED.map((s) => s.id));
  const [insts, setInsts]         = useState(buildInitialInsts());
  const [addOpen, setAddOpen]     = useState(false);
  const [newName, setNewName]     = useState("");
  const [newRole, setNewRole]     = useState("Swim Instructor");
  const [newAvail, setNewAvail]   = useState("");
  const [newAges, setNewAges]     = useState("All ages");
  const [newBadge, setNewBadge]   = useState("");
  const [nameError, setNameError] = useState("");

  /**
   * Toggles an instructor's selected state.
   * @param {string} id - Instructor ID
   */
  function togInst(id) {
    setInsts((prev) => ({ ...prev, [id]: { ...prev[id], sel: !prev[id].sel } }));
  }

  /**
   * Updates a single field on an instructor.
   * @param {string} id - Instructor ID
   * @param {string} key - Field name
   * @param {*} val - New value
   */
  function updInst(id, key, val) {
    setInsts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  }

  /**
   * Adds a new custom instructor to the roster.
   * Sets nameError if the name is blank or a duplicate.
   */
  function addInst() {
    if (!newName.trim()) return;
    const isDuplicate = Object.values(insts).some(
      (inst) => inst.name.trim().toLowerCase() === newName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setNameError("An instructor with this name already exists.");
      return;
    }
    setNameError("");
    const id  = "c_" + Date.now();
    const col = COLORS[instOrder.length % COLORS.length];
    setInsts((prev) => ({
      ...prev,
      [id]: {
        sel: true,
        name: newName.trim(),
        role: newRole.trim() || "Swim Instructor",
        avail: newAvail.trim() || "TBD",
        badge: newBadge.trim() || "Available",
        ages: newAges.trim() || "All ages",
        pro: false,
        col,
        ini: initials(newName),
        bb: "#e8f5e9",
        bc: "#2e7d32",
        dark: false,
        custom: true,
      },
    }));
    setInstOrder((prev) => [...prev, id]);
    setNewName("");
    setNewRole("Swim Instructor");
    setNewAvail("");
    setNewAges("All ages");
    setNewBadge("");
    setAddOpen(false);
  }

  /**
   * Removes a custom instructor from the roster.
   * @param {string} id - Instructor ID
   */
  function removeInst(id) {
    setInstOrder((prev) => prev.filter((x) => x !== id));
    setInsts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return {
    instOrder, setInstOrder,
    insts, setInsts,
    addOpen, setAddOpen,
    newName, setNewName,
    newRole, setNewRole,
    newAvail, setNewAvail,
    newAges, setNewAges,
    newBadge, setNewBadge,
    nameError, setNameError,
    togInst, updInst, addInst, removeInst,
  };
}
