interface ScrollProgressProps {
  progress: number;
}

export function ScrollProgress({ progress }: ScrollProgressProps) {
  return <div class="scroll-progress" style={{ width: progress + '%' }}></div>;
}
