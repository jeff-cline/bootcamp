import { prisma } from '@/lib/db'

export const logActivity = (userId: string, action: string, detail?: string) =>
  prisma.activityLog.create({ data: { userId, action, detail } }).catch(() => null)
