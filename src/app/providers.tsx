'use client';

import { QueueProvider } from '@/context/QueueContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueueProvider>{children}</QueueProvider>;
}
