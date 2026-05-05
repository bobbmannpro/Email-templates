import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { SEED, COLORS } from "../config.js";
import { initials } from "../utils/email.js";

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
      photo: s.photo || null,
      custom: false,
    };
  }
  return result;
}

export function useInstructors() {
  const [instOrder, setInstOrder] = useLocalStorage("cfc_instOrder", SEED.map((s) => s.id));
  const [insts, setInsts]         = useLocalStorage("cfc_insts", buildInitialInsts());
  const [addOpen, setAddOpen]     = useState(false);
  const [newName, setNewName]     = useState("");
  const [newRole, setNewRole]     = useState("Swim Instructor");
  const [newAvail, setNewAvail]   = useState("");
  const [newAges, setNewAges]     = useState("All ages");
  const [newBadge, setNewBadge]   = useState("");
  const [nameError, setNameError] = useState("");

  function togInst(id) {
    setInsts((prev) => ({ ...prev, [id]: { ...prev[id], sel: !prev[id].sel } }));
  }

  function updInst(id, key, val) {
    setInsts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  }

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
        photo: null,
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
