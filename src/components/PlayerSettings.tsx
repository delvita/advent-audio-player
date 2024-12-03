import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlayerSettingsProps {
  listHeight: string;
  sortAscending: boolean;
  showFirstPost: boolean;
  playerType: 'big' | 'medium' | 'small';
  onHeightChange: (height: string) => void;
  onSortChange: (sort: boolean) => void;
  onFirstPostChange: (show: boolean) => void;
  onPlayerTypeChange: (type: 'big' | 'medium' | 'small') => void;
}

export const PlayerSettings = ({
  listHeight,
  sortAscending,
  showFirstPost,
  playerType,
  onHeightChange,
  onSortChange,
  onFirstPostChange,
  onPlayerTypeChange,
}: PlayerSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="listHeight">List Height (px)</Label>
        <Input
          id="listHeight"
          type="number"
          value={listHeight}
          onChange={(e) => onHeightChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="sortAscending"
          checked={sortAscending}
          onCheckedChange={onSortChange}
        />
        <Label htmlFor="sortAscending">Sort Oldest First</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showFirstPost"
          checked={showFirstPost}
          onCheckedChange={onFirstPostChange}
        />
        <Label htmlFor="showFirstPost">Show First Post Initially</Label>
      </div>

      <div>
        <Label>Player Size</Label>
        <RadioGroup value={playerType} onValueChange={onPlayerTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="big" id="big" />
            <Label htmlFor="big">Big</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small">Small</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};