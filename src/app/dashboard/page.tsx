
'use client';

import { useQueue } from '@/context/QueueContext';
import { departments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Users, Clock, AlertTriangle, PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Department } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function getStatus(queueLength: number): {
  label: 'Balanced' | 'Busy' | 'Overloaded';
  color: string;
  indicator: string;
} {
  if (queueLength < 10) {
    return {
      label: 'Balanced',
      color: 'text-green-600',
      indicator: 'bg-green-500',
    };
  }
  if (queueLength <= 18) {
    return {
      label: 'Busy',
      color: 'text-yellow-600',
      indicator: 'bg-yellow-500',
    };
  }
  return {
    label: 'Overloaded',
    color: 'text-red-600',
    indicator: 'bg-red-500',
  };
}

const DepartmentCard = ({
  department,
  queueLength,
}: {
  department: Department;
  queueLength: number;
}) => {
  const status = getStatus(queueLength);

  return (
    <Card
      className={cn(
        'transition-all',
        status.label === 'Overloaded' && 'bg-red-50 border-red-200',
        status.label === 'Busy' && 'bg-yellow-50 border-yellow-200',
        status.label === 'Balanced' && 'bg-green-50 border-green-200'
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base font-medium">
          {department.name}
          <span
            className={cn(
                'inline-block h-3 w-3 rounded-full',
                status.indicator
            )}
            />
        </CardTitle>
      </CardHeader>
      <CardContent>
         <div className="text-2xl font-bold">{queueLength}</div>
        <p className="text-xs text-muted-foreground">patients waiting</p>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const { queues, bookAppointment, completeAppointment, getTotalQueueSize } = useQueue();
  
  const [delayedDepartments, setDelayedDepartments] = useState<string[]>([]);

  useEffect(() => {
    const newDelayed: string[] = [];
    departments.forEach(dept => {
      const queue = queues[dept.id] || 0;
      if (queue * dept.avgConsultationTime > 45) {
        newDelayed.push(dept.name);
      }
    });
    setDelayedDepartments(newDelayed);
  }, [queues]);


  const overloadedDepartment = useMemo(() => {
    return departments.find(dept => (queues[dept.id] || 0) > 18);
  }, [queues]);

  const addRandomWalkIn = () => {
    const randomDeptIndex = Math.floor(Math.random() * departments.length);
    const deptId = departments[randomDeptIndex].id;
    bookAppointment(deptId);
  };

  const completeRandomAppointment = () => {
    const busyDepartments = departments.filter(d => (queues[d.id] || 0) > 0);
    if(busyDepartments.length === 0) return;
    const randomDeptIndex = Math.floor(Math.random() * busyDepartments.length);
    const deptId = busyDepartments[randomDeptIndex].id;
    completeAppointment(deptId);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Hospital Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time overview of patient flow and department load.
        </p>
      </div>
      
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients in Queue</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getTotalQueueSize()}</div>
                <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
                 <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{Object.values(queues).filter(q => q > 0).length}</div>
                <p className="text-xs text-muted-foreground">Departments with waiting patients</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delayed Departments</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{delayedDepartments.length}</div>
                <p className="text-xs text-muted-foreground">Potential wait time over 45 mins</p>
            </CardContent>
        </Card>
      </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-8'>
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor / Department Queue View</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead className="text-right">Queue</TableHead>
                                <TableHead className="text-right">Avg. Time</TableHead>
                                <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departments.map(dept => {
                                    const queue = queues[dept.id] || 0;
                                    const status = getStatus(queue);
                                    return (
                                        <TableRow key={dept.id}>
                                            <TableCell className="font-medium">{dept.doctor}</TableCell>
                                            <TableCell>{dept.name}</TableCell>
                                            <TableCell className="text-right">{queue}</TableCell>
                                            <TableCell className="text-right">{dept.avgConsultationTime} min</TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <span className={cn('h-2.5 w-2.5 rounded-full', status.indicator)}></span>
                                                    <span className={cn(status.color, 'font-medium')}>{status.label}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Load Heatmap</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         {departments.map((dept) => (
                            <DepartmentCard
                                key={dept.id}
                                department={dept}
                                queueLength={queues[dept.id] || 0}
                            />
                            ))}
                    </CardContent>
                </Card>
            </div>
            <div className='space-y-8'>
                <Card>
                    <CardHeader><CardTitle>Delay Alerts</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {delayedDepartments.length > 0 ? delayedDepartments.map(deptName => (
                             <Alert variant="destructive" key={deptName}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>{deptName} delayed</AlertTitle>
                                <AlertDescription>
                                    Wait time exceeds 45 mins. Consider load balancing.
                                </AlertDescription>
                            </Alert>
                        )) : <p className="text-sm text-muted-foreground">No significant delays right now.</p>}
                         {overloadedDepartment && (
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>{overloadedDepartment.name} is Overloaded</AlertTitle>
                                <AlertDescription>
                                    Redirect new patients to General Medicine if possible.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Live Update Simulation</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <p className="text-sm text-muted-foreground">
                            Simulate real-time changes to the queues.
                        </p>
                        <Button className="w-full" onClick={addRandomWalkIn}><PlusCircle/>Add Walk-in Patient</Button>
                        <Button className="w-full" variant="secondary" onClick={completeRandomAppointment}><MinusCircle/>Doctor Becomes Available</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
