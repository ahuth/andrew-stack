import {useId, type InputHTMLAttributes, type ReactNode, type Ref} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  domRef?: Ref<HTMLInputElement>;
  error?: string | null;
  fieldLabel: ReactNode;
};

export default function InputField({
  domRef,
  error,
  fieldLabel,
  id,
  ...rest
}: Props) {
  const errorId = useId();
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId}>{fieldLabel}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="input input-bordered w-full"
        id={inputId}
        ref={domRef}
        {...rest}
      />
      {error && (
        <div className="label" id={errorId}>
          <span className="label-text-alt text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
}
