type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <span className="text-sm bg-neutral-800 px-2 py-1 rounded">{label}</span>
  );
}
