import { useState } from "react";
import { HEADER_TEMPLATES } from "../config.js";

/**
 * Custom hook for managing the email header form state.
 * @returns {Object} Header state, setters, and cycleTemplate action
 */
export function useHeaderForm() {
  const [hTitle, setHTitle]     = useState("Private Swim Lessons");
  const [hSub, setHSub]         = useState(
    "Whether your child is diving in for the first time or refining their stroke technique, our certified instructors are ready to help."
  );
  const [hBullets, setHBullets] = useState([
    "After-school & weekend availability",
    "Beginner to advanced levels",
    "Personalized certified instruction",
    "All ages welcome",
  ]);
  const [tplIdx, setTplIdx] = useState(0);

  /**
   * Advances to the next header template and applies it to the form fields.
   */
  function cycleTemplate() {
    const next = (tplIdx + 1) % HEADER_TEMPLATES.length;
    setTplIdx(next);
    const t = HEADER_TEMPLATES[next];
    setHTitle(t.title);
    setHSub(t.subtitle);
    setHBullets([...t.bullets]);
  }

  return {
    hTitle, setHTitle,
    hSub, setHSub,
    hBullets, setHBullets,
    tplIdx,
    cycleTemplate,
  };
}
