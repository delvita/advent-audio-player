import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2 } from "lucide-react";
import { PlayerSettings as PlayerSettingsType } from '@/types/playerSettings';

interface TemplatesListProps {
  templates: PlayerSettingsType[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TemplatesList = ({ templates, onEdit, onDelete }: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-4">
        Keine gespeicherten Templates vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{template.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(template.id)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};