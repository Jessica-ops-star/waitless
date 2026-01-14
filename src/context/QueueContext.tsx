'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { departments } from '@/lib/data';

type QueueState = {
  [key: string]: number;
};

interface QueueContextType {
  queues: QueueState;
  bookAppointment: (departmentId: string) => void;
  getDepartmentQueue: (departmentId: string) => number;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const initialQueues: QueueState = departments.reduce((acc, dept) => {
  // Initialize with some random-ish base numbers for demonstration
  let initialCount = 5;
  if (dept.id === 'general-medicine') initialCount = 12;
  if (dept.id === 'orthopedics') initialCount = 8;
  acc[dept.id] = initialCount;
  return acc;
}, {} as QueueState);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [queues, setQueues] = useState<QueueState>(initialQueues);

  const bookAppointment = (departmentId: string) => {
    setQueues((prevQueues) => ({
      ...prevQueues,
      [departmentId]: (prevQueues[departmentId] || 0) + 1,
    }));
  };

  const getDepartmentQueue = (departmentId: string) => {
    return queues[departmentId] || 0;
  };

  return (
    <QueueContext.Provider value={{ queues, bookAppointment, getDepartmentQueue }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
