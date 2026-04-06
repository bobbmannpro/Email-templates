import { useState } from "react";
import { HEADER_TEMPLATES, HEADER_TITLES } from "../config.js";

function randomTitle() {
  return HEADER_TITLES[Math.floor(Math.random() * HEADER_TITLES.length)];
}

function randomTemplate() {
  return HEADER_TEMPLATES[Math.floor(Math.random() * HEADER_TEMPLATES.length)];
}

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

  /**
   * Picks a random headline and a random subtitle+bullets template.
   */
  function cycleTemplate() {
    const t = randomTemplate();
    setHTitle(randomTitle());
    setHSub(t.subtitle);
    setHBullets([...t.bullets]);
  }

  return {
    hTitle, setHTitle,
    hSub, setHSub,
    hBullets, setHBullets,
    cycleTemplate,
  };
}
