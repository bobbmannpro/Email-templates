import { useState } from "react";
import { EMAIL_SUBJECTS, HEADER_TITLES, HEADER_TEMPLATES } from "../config.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Custom hook for managing the email header form state.
 * @returns {Object} Header state, setters, subject selector, and cycleTemplate action
 */
export function useHeaderForm() {
  const [subjectId, setSubjectId] = useState("swim_lessons");
  const [hTitle, setHTitle]       = useState("Private Swim Lessons");
  const [hSub, setHSub]           = useState(
    "Whether your child is diving in for the first time or refining their stroke technique, our certified instructors are ready to help."
  );
  const [hBullets, setHBullets]   = useState([
    "After-school & weekend availability",
    "Beginner to advanced levels",
    "Personalized certified instruction",
    "All ages welcome",
  ]);

  /**
   * Changes the active subject and immediately shuffles a matching headline + template.
   * @param {string} id - Subject ID from EMAIL_SUBJECTS
   */
  function changeSubject(id) {
    setSubjectId(id);
    const subject = EMAIL_SUBJECTS.find((s) => s.id === id);
    if (subject) {
      const t = pick(subject.templates);
      setHTitle(pick(subject.titles));
      setHSub(t.subtitle);
      setHBullets([...t.bullets]);
    }
  }

  /**
   * Picks a random headline and template from the active subject pool.
   */
  function cycleTemplate() {
    const subject = EMAIL_SUBJECTS.find((s) => s.id === subjectId);
    if (subject) {
      const t = pick(subject.templates);
      setHTitle(pick(subject.titles));
      setHSub(t.subtitle);
      setHBullets([...t.bullets]);
    } else {
      // Fallback to global pool if no subject matched
      const t = pick(HEADER_TEMPLATES);
      setHTitle(pick(HEADER_TITLES));
      setHSub(t.subtitle);
      setHBullets([...t.bullets]);
    }
  }

  return {
    subjectId, changeSubject,
    hTitle, setHTitle,
    hSub, setHSub,
    hBullets, setHBullets,
    cycleTemplate,
  };
}
