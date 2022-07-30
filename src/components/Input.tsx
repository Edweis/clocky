import React from 'react';
import cn from 'classnames';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
};
const Input = React.forwardRef((props: Props, ref) => {
  const { className, errorMessage, ...otherProps } = props;
  return (
    <div>
      <input
        ref={ref as any}
        className={cn(
          'w-full shadow-sm focus:ring-blue-700 focus:border-blue-700 block  sm:text-sm border-gray-300 rounded-md',
          className,
        )}
        {...otherProps}
      />
      {errorMessage && (
        <div className="w-full text-red-700">{errorMessage}</div>
      )}
    </div>
  );
});
export default Input;
