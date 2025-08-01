export const trackingIdGenerator = () => {
  const now = new Date();

  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `TRK-${datePart}-${randomPart}`;
};
