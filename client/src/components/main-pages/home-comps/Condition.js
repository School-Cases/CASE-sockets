export const ConditionRenderer = ({ condition, children }) => {
  return <>{condition && children}</>;
};
