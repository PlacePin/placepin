import { STEPS, type PassportStep } from "../pages/settings/passport/TenantPassport";

export function getPillStatus(
  pillStep: PassportStep,
  currentStep: PassportStep
): "complete" | "current" | "upcoming" {
  const pillIdx = STEPS.indexOf(pillStep);
  const currentIdx = STEPS.indexOf(currentStep);
  if (pillIdx < currentIdx) return "complete";
  if (pillIdx === currentIdx) return "current";
  return "upcoming";
}
