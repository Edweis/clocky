import cn from 'classnames';

export default function Button(props:React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...otherProps } = props;
  return (
    <button
      type="button"
      className={cn(
        'text-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}
