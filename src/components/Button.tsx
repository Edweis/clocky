import cn from 'classnames';
import Loading from './Loading';

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean },
) {
  const { className, children, loading, disabled, ...otherProps } = props;
  return (
    <button
      type="button"
      className={cn(
        'h-[42px] text-center items-center px-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500',
        className,
        { 'flex justify-center': loading },
      )}
      disabled={disabled || loading}
      {...otherProps}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}
