
import { useSession } from "next-auth/react"

export function useProjectStatus(project: any) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  // The Sovereign Truth: logic for calibration
  const isCalibrated = 
    project?.status === 'CALIBRATED' || 
    project?.status === 'ACTIVE' || 
    project?.status === 'CERTIFIED'

  // The Deadbolt: absolute boolean for client role
  // If no project is loaded, we default to locked for safety
  const isLocked = (!isCalibrated && !isAdmin) || !project

  return {
    isCalibrated,
    isAdmin,
    isLocked
  }
}
