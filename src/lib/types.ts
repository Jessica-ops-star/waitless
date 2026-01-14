import type { LucideIcon } from "lucide-react";

export type Department = {
  id: string;
  name: string;
  icon: LucideIcon;
  doctor: string;
  avgConsultationTime: number; // in minutes
};

export type Hospital = {
  id: string;
  name: string;
};

export type QueueStatus = 'Low' | 'Medium' | 'High';
