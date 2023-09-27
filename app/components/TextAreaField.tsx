import {
  useId,
  type TextareaHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  domRef?: Ref<HTMLTextAreaElement>;
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
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        id={inputId}
        ref={domRef}
        {...rest}
      />
      {error && (
        <div className="pt-1 text-red-700" id={errorId}>
          {error}
        </div>
      )}
    </div>
  );
}
