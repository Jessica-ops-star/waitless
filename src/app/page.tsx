
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';
import { Hospital, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center justify-center bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Logo />
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Know your wait. Choose your time.
            </p>
            <div className="flex w-full max-w-sm flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="flex-1">
                <Link href="/check-wait-time">
                  <User className="mr-2 h-5 w-5" />I am a Patient
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="flex-1">
                <Link href="/dashboard">
                  <Hospital className="mr-2 h-5 w-5" />
                  Hospital Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
