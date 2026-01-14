import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="font-headline text-2xl font-bold text-primary transition-colors hover:text-primary/90"
    >
      WAITLESS
    </Link>
  );
}
