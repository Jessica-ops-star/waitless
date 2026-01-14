'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hospital, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handlePatientLogin = () => {
    router.push('/check-wait-time');
  };

  const handleStaffLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-1 items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl text-primary">
            WAITLESS
          </CardTitle>
          <CardDescription className="text-md">
            Know your wait. Choose your time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">
                <User className="mr-2 h-4 w-4" />
                I'm a Patient
              </TabsTrigger>
              <TabsTrigger value="staff">
                <Hospital className="mr-2 h-4 w-4" />
                I'm Hospital Staff
              </TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Patient Login</CardTitle>
                  <CardDescription>
                    Access wait times and book your visit.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="patient@example.com"
                      defaultValue="patient@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" type="password" defaultValue="password" />
                  </div>
                  <Button onClick={handlePatientLogin} className="w-full">
                    Login as Patient
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="staff">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle>Staff Login</CardTitle>
                  <CardDescription>
                    Access the real-time hospital dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="staff@hospital.com"
                      defaultValue="staff@hospital.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input id="staff-password" type="password" defaultValue="password" />
                  </div>
                  <Button onClick={handleStaffLogin} className="w-full">
                    Login to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
