'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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
  acc[dept.id] = Math.floor(Math.random() * 25) + 1;
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
  
  const simulateWalkIns = useCallback(() => {
    const randomDeptIndex = Math.floor(Math.random() * departments.length);
    const deptId = departments[randomDeptIndex].id;
    if (Math.random() < 0.2) { // 20% chance to increment a queue
        bookAppointment(deptId);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateWalkIns, 5000); // simulate a walk-in every 5 seconds
    return () => clearInterval(interval);
  }, [simulateWalkIns]);


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
