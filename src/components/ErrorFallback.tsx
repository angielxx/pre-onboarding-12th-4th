interface Props {
  resetErrorBoundary: () => void;
  error: unknown | Error;
}

export const ErrorFallback = ({ resetErrorBoundary, error }: Props) => {
  const resetOnClick = () => resetErrorBoundary();

  return (
    <div>
      <p>{error?.message}</p>
      <button onClick={resetOnClick}>Try again</button>
    </div>
  );
};
