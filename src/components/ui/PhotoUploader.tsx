import { useRef, useState } from 'react';

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function PhotoUploader({ files, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    onChange([...files, ...valid]);
  }

  function remove(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-terracotta bg-terracotta/5' : 'border-sand-dark hover:border-charcoal/30'
        }`}
        style={{ borderColor: dragging ? 'var(--color-terracotta)' : undefined }}
      >
        <div className="text-2xl mb-1">📷</div>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
          Drop photos here or <span style={{ color: 'var(--color-terracotta)' }}>click to browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
