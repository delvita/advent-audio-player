import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorSettingsProps {
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
  };
  onChange: (colors: any) => void;
}

export const ColorSettings = ({ colors, onChange }: ColorSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="background">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="background"
            type="color"
            value={colors.background}
            onChange={(e) => onChange({ ...colors, background: e.target.value })}
            className="w-16"
          />
          <Input
            type="text"
            value={colors.background}
            onChange={(e) => onChange({ ...colors, background: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="text">Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="text"
            type="color"
            value={colors.text}
            onChange={(e) => onChange({ ...colors, text: e.target.value })}
            className="w-16"
          />
          <Input
            type="text"
            value={colors.text}
            onChange={(e) => onChange({ ...colors, text: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="primary">Primary Color</Label>
        <div className="flex gap-2">
          <Input
            id="primary"
            type="color"
            value={colors.primary}
            onChange={(e) => onChange({ ...colors, primary: e.target.value })}
            className="w-16"
          />
          <Input
            type="text"
            value={colors.primary}
            onChange={(e) => onChange({ ...colors, primary: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="secondary">Secondary Color</Label>
        <div className="flex gap-2">
          <Input
            id="secondary"
            type="color"
            value={colors.secondary}
            onChange={(e) => onChange({ ...colors, secondary: e.target.value })}
            className="w-16"
          />
          <Input
            type="text"
            value={colors.secondary}
            onChange={(e) => onChange({ ...colors, secondary: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};