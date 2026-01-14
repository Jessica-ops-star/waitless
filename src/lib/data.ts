'use client';
import {
  HeartPulse,
  Bone,
  Stethoscope,
  Baby,
  Brain,
  Ear,
} from 'lucide-react';
import type { Department, Hospital } from '@/lib/types';

export const hospitals: Hospital[] = [
  { id: 'city-general', name: 'City General Hospital' },
];

export const departments: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: HeartPulse,
    doctor: 'Dr. Emily Carter',
    avgConsultationTime: 20,
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: Bone,
    doctor: 'Dr. James Rodriguez',
    avgConsultationTime: 25,
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: Stethoscope,
    doctor: 'Dr. Sarah Lee',
    avgConsultationTime: 15,
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: Baby,
    doctor: 'Dr. Michael Chen',
    avgConsultationTime: 18,
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: Brain,
    doctor: 'Dr. Jessica Taylor',
    avgConsultationTime: 30,
  },
  {
    id: 'ent',
    name: 'ENT',
    icon: Ear,
    doctor: 'Dr. David Wilson',
    avgConsultationTime: 12,
  },
];
