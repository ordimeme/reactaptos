interface TagProps {
  variant: 'buy' | 'sell' | 'bonding' | 'regular';
  children: React.ReactNode;
  className?: string;
}

export function Tag({ variant, children, className = '' }: TagProps) {
  const variantStyles = {
    buy: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
    sell: 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400',
    bonding: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    regular: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-400'
  };

  return (
    <div className={`
      inline-flex items-center justify-center
      h-4 min-w-[24px]
      px-1.5
      text-[10px] font-medium leading-none
      rounded
      ${variantStyles[variant]}
      ${className}
    `}>
      {children}
    </div>
  );
} 