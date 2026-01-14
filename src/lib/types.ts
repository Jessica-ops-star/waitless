export type Department = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  doctor: string;
  avgConsultationTime: number; // in minutes
};

export type Hospital = {
  id: string;
  name: string;
};

export type QueueStatus = 'Low' | 'Medium' | 'High';
