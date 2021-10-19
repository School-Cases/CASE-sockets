export const If = ({ condition, children }) => {
  return <>{condition && children}</>;
};
