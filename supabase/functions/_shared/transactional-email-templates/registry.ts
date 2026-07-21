import type { ComponentType } from 'npm:react@18.3.1'
import { template as weeklyHeatCheck } from './weekly-heat-check.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'weekly-heat-check': weeklyHeatCheck,
}