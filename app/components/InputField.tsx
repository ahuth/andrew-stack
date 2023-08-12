import {useId, type InputHTMLAttributes, type Ref} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export default function InputField({error, inputRef, ...rest}: Props) {
  const errorId = useId();

  return (
    <>
      <input
        ref={inputRef}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        {...rest}
      />
      {error && (
        <div className="pt-1 text-red-700" id={errorId}>
          {error}
        </div>
      )}
    </>
  );
}
