import {useId, type InputHTMLAttributes, type ReactNode, type Ref} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  inputLabel: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
};

export default function InputField({
  error,
  id,
  inputLabel,
  inputRef,
  ...rest
}: Props) {
  const errorId = useId();
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId}>{inputLabel}</label>
      <input
        ref={inputRef}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="input input-bordered w-full"
        id={inputId}
        {...rest}
      />
      {error && (
        <div className="label text-red-700" id={errorId}>
          <span className="label-text-alt">{error}</span>
        </div>
      )}
    </div>
  );
}
