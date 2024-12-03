import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PlayerSettingsProps {
  listHeight: string;
  sortAscending: boolean;
  showFirstPost: boolean;
  onHeightChange: (height: string) => void;
  onSortChange: (sort: boolean) => void;
  onFirstPostChange: (show: boolean) => void;
}

export const PlayerSettings = ({
  listHeight,
  sortAscending,
  showFirstPost,
  onHeightChange,
  onSortChange,
  onFirstPostChange,
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
    </div>
  );
};