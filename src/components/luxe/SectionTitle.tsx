export default function SectionTitle({ title, script }: { title: string; script?: string }) {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-luxe-line" />
      <h2 className="relative text-center">
        <span className="luxe-title block text-3xl md:text-5xl">{title}</span>
        {script && <span className="luxe-script -mt-2 block text-3xl md:-mt-4 md:text-5xl">{script}</span>}
      </h2>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-luxe-line" />
    </div>
  );
}
