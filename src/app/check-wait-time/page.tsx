
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, Lightbulb, Users, CheckCircle, Hourglass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getWaitTimePrediction, getOptimalVisitTime } from '@/lib/actions';
import { hospitals, departments } from '@/lib/data';
import type { PredictDepartmentWaitingTimeOutput } from '@/ai/flows/predict-department-waiting-time';
import type { SuggestOptimalVisitTimeOutput } from '@/ai/flows/suggest-optimal-visit-time';
import { useQueue } from '@/context/QueueContext';
import { cn } from '@/lib/utils';
import type { Department } from '@/lib/types';

const formSchema = z.object({
  hospital: z.string().min(1, 'Please select a hospital.'),
  department: z.string().min(1, 'Please select a department.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckWaitTimePage() {
  const [prediction, setPrediction] =
    useState<PredictDepartmentWaitingTimeOutput | null>(null);
  const [suggestion, setSuggestion] =
    useState<SuggestOptimalVisitTimeOutput | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { bookAppointment, getDepartmentQueue } = useQueue();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospital: 'city-general',
      department: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setPrediction(null);
    setSuggestion(null);
    const department = departments.find((d) => d.id === values.department) || null;
    setSelectedDepartment(department);

    if (!department) {
        setIsLoading(false);
        return;
    }

    try {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const result = await getWaitTimePrediction(
        values.hospital,
        department.name,
        currentTime
      );
      setPrediction(result);

      if (result.queueStatus === 'High') {
        setIsSuggestionLoading(true);
        const suggestionResult = await getOptimalVisitTime(
          values.hospital,
          department.name,
          result.estimatedWaitTimeMinutes,
          currentTime
        );
        setSuggestion(suggestionResult);
        setIsSuggestionLoading(false);
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = (
    departmentId: string,
    departmentName: string,
    time: string
  ) => {
    bookAppointment(departmentId);
    router.push(
      `/confirmation?department=${encodeURIComponent(
        departmentName
      )}&time=${encodeURIComponent(time)}`
    );
  };
  
  const statusColors: { [key: string]: string } = {
    Low: 'text-green-600 bg-green-100 border-green-200',
    Medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
    High: 'text-red-600 bg-red-100 border-red-200',
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Check Live Wait Times
          </CardTitle>
          <CardDescription>
            Select a hospital and department to get a real-time wait time
            prediction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hospital" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hospitals.map((hospital) => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            setPrediction(null);
                            setSuggestion(null);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading || !form.getValues().department} className="w-full">
                {isLoading ? 'Predicting...' : 'Check Waiting Time'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <PredictionSkeleton />}

      {prediction && selectedDepartment && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
               <selectedDepartment.icon className="h-10 w-10 text-primary" />
                <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                    {selectedDepartment.name}
                    </CardTitle>
                    <CardDescription>
                    {selectedDepartment.doctor}
                    </CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-4 rounded-lg border bg-secondary p-4">
                <Hourglass className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Predicted Wait
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.floor(prediction.estimatedWaitTimeMinutes / 60)}h {prediction.estimatedWaitTimeMinutes % 60}m
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border bg-secondary p-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Queue Length</p>
                  <p className="text-2xl font-bold">
                    {getDepartmentQueue(selectedDepartment.id)}
                  </p>
                </div>
              </div>
               <div className="flex items-center space-x-4 rounded-lg border bg-secondary p-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Queue Status</p>
                  <p
                    className={cn(
                      'text-2xl font-bold',
                       statusColors[prediction.queueStatus] || 'text-foreground'
                    )}
                  >
                     <span
                      className={cn(
                        'inline-block h-3 w-3 rounded-full mr-2',
                        prediction.queueStatus === 'Low' && 'bg-green-500',
                        prediction.queueStatus === 'Medium' && 'bg-yellow-500',
                        prediction.queueStatus === 'High' && 'bg-red-500',
                      )}
                    ></span>
                    {prediction.queueStatus}
                  </p>
                </div>
              </div>
            </div>

            {isSuggestionLoading && <SuggestionSkeleton />}

            {suggestion && (
                <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-800">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 flex-shrink-0 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-bold">✨ Smart Suggestion</h4>
                      <p className="mt-1">{suggestion.reason}</p>
                      <div className="mt-4 flex flex-col gap-2 rounded-md bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                        <p className="font-semibold">
                          Suggested Slot: {' '}
                          <span className="text-primary">
                            {suggestion.suggestedTime}
                          </span>
                        </p>
                         <p className="text-sm text-muted-foreground">
                          Expected wait: {suggestion.expectedWaitTime} mins
                        </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleBooking(
                              selectedDepartment.id,
                              selectedDepartment.name,
                              suggestion.suggestedTime
                            )
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4"/>
                          Confirm Visit Time
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold">Continue with Current Time</h4>
                <p className="text-sm text-muted-foreground">
                  Proceed with the estimated wait of{' '}
                  {prediction.estimatedWaitTimeMinutes} minutes.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  handleBooking(
                    selectedDepartment.id,
                    selectedDepartment.name,
                    'Current Time'
                  )
                }
              >
                Continue Anyway
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PredictionSkeleton() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
             <Skeleton className="h-7 w-48" />
             <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-20" />
      </CardContent>
    </Card>
  );
}

function SuggestionSkeleton() {
    return (
        <div className="rounded-lg border border-blue-300 bg-blue-50 p-4">
             <div className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <div className="mt-4 flex items-center justify-between rounded-md bg-white p-4">
                        <div className='space-y-2'>
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-36" />
                    </div>
                </div>
            </div>
        </div>
    )
}
