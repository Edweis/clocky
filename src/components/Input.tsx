import React from 'react';
import cn from 'classnames';

type Props = React.InputHTMLAttributes<HTMLInputElement>
    & { className?:string, label:string }
export default function Input(props:Props) {
  const { className, label, ...otherProps } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="number"
          className={cn(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            className,
          )}
          {...otherProps}
        />
      </div>
    </div>
  );
}
