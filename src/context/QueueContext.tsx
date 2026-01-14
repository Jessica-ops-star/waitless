
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { departments } from '@/lib/data';

type QueueState = {
  [key: string]: number;
};

interface QueueContextType {
  queues: QueueState;
  bookAppointment: (departmentId: string) => void;
  completeAppointment: (departmentId: string) => void;
  getDepartmentQueue: (departmentId: string) => number;
  getTotalQueueSize: () => number;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const initialQueues: QueueState = departments.reduce((acc, dept) => {
  acc[dept.id] = Math.floor(Math.random() * 8) + 1;
  return acc;
}, {} as QueueState);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [queues, setQueues] = useState<QueueState>(initialQueues);

  const bookAppointment = useCallback((departmentId: string) => {
    setQueues((prevQueues) => ({
      ...prevQueues,
      [departmentId]: (prevQueues[departmentId] || 0) + 1,
    }));
  }, []);

  const completeAppointment = useCallback((departmentId: string) => {
    setQueues((prevQueues) => ({
      ...prevQueues,
      [departmentId]: Math.max(0, (prevQueues[departmentId] || 0) - 1),
    }));
  }, []);

  const getDepartmentQueue = (departmentId: string) => {
    return queues[departmentId] || 0;
  };

  const getTotalQueueSize = () => {
      return Object.values(queues).reduce((total, count) => total + count, 0);
  }

  return (
    <QueueContext.Provider value={{ queues, bookAppointment, completeAppointment, getDepartmentQueue, getTotalQueueSize }}>
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
