export const scrollToBottom = (ref, behavior = "smooth") => {
  if (!ref || !ref.current) return;

  ref.current.scrollIntoView({
    behavior,
  });
};