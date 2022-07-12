import React from 'react';
import cn from 'classnames';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label: string;
  autoSelect?: boolean;
};
const Input = React.forwardRef((props: Props, ref) => {
  const { className, label, ...otherProps } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        <input
          ref={ref as any}
          className={cn(
            'shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md',
            className,
          )}
          {...otherProps}
        />
      </div>
    </div>
  );
});
export default Input;
