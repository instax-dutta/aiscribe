function formatSrtTime(totalSeconds: number): string {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s},000`;
}

export function generateSrt(text: string): string {
  const sentences = text.match(/[^.!?\n]+[.!?]*\s*/g) || [text];
  const avgChunkLength = 200;
  const chunkSize = Math.max(1, Math.ceil(sentences.length / Math.max(1, Math.ceil(text.length / avgChunkLength))));
  const chunkDuration = 10;

  let srt = 'NOTE: Timestamps are approximate\n\n';
  let idx = 1;

  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunk = sentences.slice(i, i + chunkSize).join('').trim();
    if (!chunk) continue;

    const startSec = Math.floor(i / chunkSize) * chunkDuration;
    const endSec = startSec + chunkDuration;

    srt += `${idx}\n`;
    srt += `${formatSrtTime(startSec)} --> ${formatSrtTime(endSec)}\n`;
    srt += `${chunk}\n\n`;
    idx++;
  }

  return srt;
}
