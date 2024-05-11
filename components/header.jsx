export function Header() {
  return (
    <div className='bg-background border border-green-400 px-6 py-4 flex space-x-4 items-center'>
      <img src='/images/icon.png' alt='Icon' width={32} height={32} />
      <h1 className='text-foreground font-extrabold text-2xl text-green-500'>
        Nutrify
      </h1>
    </div>
  );
}
