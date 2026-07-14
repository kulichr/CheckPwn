export const TARGET_PLACEHOLDER = 'target.com';

export function applyTarget(command: string, target: string): string {
  const trimmed = target.trim();
  if (!trimmed) return command;
  return command.split(TARGET_PLACEHOLDER).join(trimmed);
}
