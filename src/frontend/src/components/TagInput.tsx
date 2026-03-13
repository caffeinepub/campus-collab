import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  "data-ocid"?: string;
}

export default function TagInput({
  tags,
  onChange,
  placeholder,
  "data-ocid": ocid,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="border-2 border-border bg-input p-2 flex flex-wrap gap-1.5 min-h-[42px] focus-within:border-primary transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 border border-accent text-accent"
          style={{ background: "oklch(0.9 0.15 195 / 0.1)" }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputValue && addTag(inputValue)}
        placeholder={tags.length === 0 ? placeholder : ""}
        data-ocid={ocid}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
