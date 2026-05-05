import { useLocalStorage } from "./useLocalStorage.js";
import { EMAIL_SUBJECTS, HEADER_TITLES, HEADER_TEMPLATES } from "../config.js";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useHeaderForm() {
  const [subjectId, setSubjectId] = useLocalStorage("cfc_subjectId", "swim_lessons");
  const [hTitle, setHTitle]       = useLocalStorage("cfc_hTitle", "Private Swim Lessons");
  const [hSub, setHSub]           = useLocalStorage("cfc_hSub",
    "Whether your child is diving in for the first time or refining their stroke technique, our certified instructors are ready to help."
  );
  const [hBullets, setHBullets]   = useLocalStorage("cfc_hBullets", [
    "After-school & weekend availability",
    "Beginner to advanced levels",
    "Personalized certified instruction",
    "All ages welcome",
  ]);

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

  function cycleTemplate() {
    const subject = EMAIL_SUBJECTS.find((s) => s.id === subjectId);
    if (subject) {
      const t = pick(subject.templates);
      setHTitle(pick(subject.titles));
      setHSub(t.subtitle);
      setHBullets([...t.bullets]);
    } else {
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
