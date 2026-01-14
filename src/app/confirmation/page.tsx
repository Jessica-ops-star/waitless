'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const department = searchParams.get('department');
  const time = searchParams.get('time');

  return (
    <div className="container mx-auto flex max-w-2xl flex-1 items-center justify-center py-12">
      <Card className="w-full text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-3xl font-headline">
            Appointment Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Your spot is reserved. Please arrive on time.
          </p>
          <div className="rounded-lg border bg-secondary p-4 text-left">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Department
                </p>
                <p className="text-lg font-bold">{department}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Arrival Time
                </p>
                <p className="text-lg font-bold text-primary">{time}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            A reminder has been sent to your registered contact details (for demo purposes).
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/check-wait-time">Check Another</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}
