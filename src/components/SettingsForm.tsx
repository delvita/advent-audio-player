import { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { ColorSettings } from "./ColorSettings";
import { PlayerSettings as PlayerSettingsComponent } from "./PlayerSettings";
import { EmbedCodes } from "./EmbedCodes";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import type { PlayerSettings } from '../types/playerSettings';

interface SettingsFormProps {
  settings: PlayerSettings;
  onSettingsChange: (settings: PlayerSettings) => void;
  onSave: () => void;
}

export const SettingsForm = ({ settings, onSettingsChange, onSave }: SettingsFormProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="settingsName">Name der Einstellungen</Label>
              <Input
                id="settingsName"
                value={settings.name}
                onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
                placeholder="Mein Custom Player"
              />
            </div>

            <div>
              <Label htmlFor="feedUrl">Feed URL</Label>
              <Input
                id="feedUrl"
                value={settings.feedUrl}
                onChange={(e) => onSettingsChange({ ...settings, feedUrl: e.target.value })}
              />
            </div>

            <ColorSettings 
              colors={settings.colors} 
              onChange={(colors) => onSettingsChange({ ...settings, colors })} 
            />
            
            <PlayerSettingsComponent
              listHeight={settings.listHeight}
              sortAscending={settings.sortAscending}
              showFirstPost={settings.showFirstPost}
              playerType={settings.playerType}
              onHeightChange={(height) => onSettingsChange({ ...settings, listHeight: height })}
              onSortChange={(sort) => onSettingsChange({ ...settings, sortAscending: sort })}
              onFirstPostChange={(show) => onSettingsChange({ ...settings, showFirstPost: show })}
              onPlayerTypeChange={(type) => onSettingsChange({ ...settings, playerType: type })}
            />

            <Button onClick={onSave} className="w-full">
              Einstellungen speichern
            </Button>

            <EmbedCodes embedId={settings.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
