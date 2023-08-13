import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  fieldLabel: ReactNode;
};

export default forwardRef<HTMLInputElement, Props>(function InputField(
  {error, fieldLabel, id, ...rest},
  ref,
) {
  const errorId = useId();
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId}>{fieldLabel}</label>
      <input
        ref={ref}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="input input-bordered w-full"
        id={inputId}
        {...rest}
      />
      {error && (
        <div className="label" id={errorId}>
          <span className="label-text-alt text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
});
