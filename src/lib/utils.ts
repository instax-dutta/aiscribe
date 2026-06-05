export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return size.toFixed(i > 0 ? 1 : 0) + ' ' + units[i];
}

export function formatDuration(seconds: number | undefined): string {
  if (!seconds || isNaN(seconds)) return 'Unknown';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return s + 's';
  return m + 'm ' + s + 's';
}


