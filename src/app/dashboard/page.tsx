'use client';

import { useQueue } from '@/context/QueueContext';
import { departments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Department } from '@/lib/types';

function getStatus(queueLength: number): {
  label: 'Low' | 'Medium' | 'High';
  color: string;
  indicator: string;
} {
  if (queueLength < 10) {
    return {
      label: 'Low',
      color: 'text-green-600',
      indicator: 'bg-green-500',
    };
  }
  if (queueLength <= 20) {
    return {
      label: 'Medium',
      color: 'text-yellow-600',
      indicator: 'bg-yellow-500',
    };
  }
  return {
    label: 'High',
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
  const { icon: Icon } = department;

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        status.label === 'High' && 'bg-red-50 border-red-200',
        status.label === 'Medium' && 'bg-yellow-50 border-yellow-200'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {department.name}
        </CardTitle>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            status.label === 'High' && 'bg-red-200 text-red-800',
            status.label === 'Medium' && 'bg-yellow-200 text-yellow-800',
            status.label === 'Low' && 'bg-green-200 text-green-800'
          )}
        >
          {status.label} Load
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold text-2xl">{queueLength}</span>
            <span className="text-muted-foreground">in queue</span>
          </div>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Avg. {department.avgConsultationTime} min consultation
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const { queues } = useQueue();

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            queueLength={queues[dept.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}
