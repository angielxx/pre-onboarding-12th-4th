interface Props {
  reset: () => void;
  error: Error;
}

export const ErrorFallback = ({ reset, error }: Props) => {
  const resetOnClick = () => reset();

  return (
    <div>
      <p>{error?.message}</p>
      <button onClick={resetOnClick}>Try again</button>
    </div>
  );
};
