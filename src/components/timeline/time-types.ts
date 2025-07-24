import {  ProgressEstimateRequestType } from "../../api/progress-estimate-requests";

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  type: ProgressEstimateRequestType
  date?: Date;
  actions?: TimelineAction[];
}

export interface TimelineAction {
  id: string;
  label: string;
  variant?: 'solid' | 'bordered' | 'light';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  onClick: () => void;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}