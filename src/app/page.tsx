import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                WAITLESS
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-gray-200 md:text-xl">
                Know your wait before you visit
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/check-wait-time">Check Waiting Time</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Streamline Your Hospital Visit
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides real-time wait estimates and smart
                  suggestions to help you choose the best time to visit the
                  hospital.
                </p>
              </div>
              <ul className="grid gap-2 py-4">
                <li>
                  <svg
                    className="mr-2 inline-block h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Live Wait Time Predictions
                </li>
                <li>
                  <svg
                    className="mr-2 inline-block h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  AI-Powered Time Slot Suggestions
                </li>
                <li>
                  <svg
                    className="mr-2 inline-block h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Real-Time Queue Status
                </li>
              </ul>
            </div>
            <div className="relative h-full min-h-[300px] w-full">
               {heroImage && (
                  <Image
                    src="https://picsum.photos/seed/waitless-features/600/400"
                    alt="Female doctor using tablet"
                    data-ai-hint="doctor tablet"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                    width={600}
                    height={400}
                  />
               )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
