type DescriptionInputProps = {
  text: string;
  onChange: (value: string) => void;
};

export function DescriptionInput({ text, onChange }: DescriptionInputProps) {
  return (
    <>
      <textarea
        className="w-full min-h-48 rounded border p-3"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste farmer/product text here..."
      />
      <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p className="font-medium">Input formatting tips</p>
        <p>Blank line = new paragraph</p>
        <p>
          <code>- item</code>, <code>* item</code>, or <code>1. item</code> =
          list item
        </p>
        <p>
          <code>## Heading text</code> = small heading
        </p>
      </div>
    </>
  );
}
