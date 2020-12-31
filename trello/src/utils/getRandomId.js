export const getRandomId = () => {
  return (Math.random() * 1e32).toString(36);
};
