
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
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Tabs defaultValue="patient" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">
            <User className="mr-2 h-4 w-4" />
            Patient Login
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Hospital className="mr-2 h-4 w-4" />
            Staff Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="patient">
          <Card>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-password">Password</Label>
                <Input id="patient-password" type="password" />
              </div>
              <Button onClick={handlePatientLogin} className="w-full">
                Login as Patient
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Staff Login</CardTitle>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-password">Password</Label>
                <Input id="staff-password" type="password" />
              </div>
              <Button onClick={handleStaffLogin} className="w-full">
                Login to Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
