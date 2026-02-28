import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface NumberInputProps {
  numbers: string[];
  onNumbersChange: (numbers: string[]) => void;
}

const NumberInput = ({ numbers, onNumbersChange }: NumberInputProps) => {
  const [bulkInput, setBulkInput] = useState("");

  const handlePaste = () => {
    const parsed = bulkInput
      .split(/[\n,;]+/)
      .map((n) => n.trim().replace(/[^\d+]/g, ""))
      .filter((n) => n.length >= 7);
    const unique = [...new Set([...numbers, ...parsed])];
    onNumbersChange(unique);
    setBulkInput("");
  };

  const removeNumber = (index: number) => {
    onNumbersChange(numbers.filter((_, i) => i !== index));
  };

  const clearAll = () => onNumbersChange([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
      <h2 className="font-mono text-sm font-semibold text-primary tracking-wider uppercase glow-text">
          Destination Numbers
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {numbers.length} loaded
        </span>
      </div>

      <div className="space-y-3">
        <Textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Paste numbers from Google Sheets (one per line, or comma-separated)..."
          className="font-mono text-sm bg-background border-border min-h-[100px] resize-none placeholder:text-muted-foreground/50"
        />
        <div className="flex gap-2">
          <Button
            onClick={handlePaste}
            disabled={!bulkInput.trim()}
            size="sm"
            className="font-mono text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Numbers
          </Button>
          {numbers.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="font-mono text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {numbers.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto space-y-1 terminal-border rounded-md p-2">
          {numbers.map((num, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-secondary/50 group"
            >
              <span className="font-mono text-xs text-foreground">{num}</span>
              <button
                onClick={() => removeNumber(i)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NumberInput;
