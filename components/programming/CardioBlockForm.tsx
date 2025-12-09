"use client";

import { useState } from "react";
import { ExerciseGroup, Segment } from "@/hooks/use-programming";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, X } from "lucide-react";

interface CardioBlockFormProps {
  exercise?: ExerciseGroup;
  onSave: (exercise: Omit<ExerciseGroup, 'id'>) => void;
  onCancel: () => void;
}

const COMMON_EQUIPMENT = [
  'Ski Erg',
  'C2 Bike',
  'Rower',
  'Treadmill',
  'Assault Bike',
  'Jump Rope',
  'Bodyweight',
];

export function CardioBlockForm({ exercise, onSave, onCancel }: CardioBlockFormProps) {
  const [name, setName] = useState(exercise?.name || '');
  const [segments, setSegments] = useState<Segment[]>(
    exercise?.segments || [
      { name: '', durationMinutes: 0, zone: '', videoId: '' }
    ]
  );
  const [equipment, setEquipment] = useState<string[]>(exercise?.equipment || []);
  const [muscleGroups, setMuscleGroups] = useState<string[]>(exercise?.muscleGroups || ['Full Body', 'Cardio']);
  const [notes, setNotes] = useState(exercise?.notes || '');
  const [customEquipment, setCustomEquipment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalDuration = segments.reduce((sum, seg) => sum + seg.durationMinutes, 0);

    const exerciseData: Omit<ExerciseGroup, 'id'> = {
      name,
      type: 'for-time',
      sets: 0,
      reps: '',
      restSeconds: 0,
      equipment,
      muscleGroups,
      notes,
      videoId: '',
      segments,
      completed: false,
    };

    onSave(exerciseData);
  };

  const addSegment = () => {
    setSegments([...segments, { name: '', durationMinutes: 0, zone: '', videoId: '' }]);
  };

  const removeSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const updateSegment = (index: number, field: keyof Segment, value: string | number) => {
    setSegments(segments.map((seg, i) =>
      i === index ? { ...seg, [field]: value } : seg
    ));
  };

  const toggleEquipment = (item: string) => {
    setEquipment(prev =>
      prev.includes(item)
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const addCustomEquipment = () => {
    if (customEquipment.trim() && !equipment.includes(customEquipment.trim())) {
      setEquipment([...equipment, customEquipment.trim()]);
      setCustomEquipment('');
    }
  };

  const totalDuration = segments.reduce((sum, seg) => sum + (seg.durationMinutes || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Block Name */}
      <div>
        <Label htmlFor="name">Block Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., 55' Mixed Cardio Group"
          required
          className="mt-1"
        />
      </div>

      {/* Total Duration Display */}
      <div className="bg-purple-50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-purple-600">
          {totalDuration}'
        </div>
        <div className="text-sm text-purple-700 font-medium">TOTAL BLOCK TIME</div>
      </div>

      {/* Segments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Segments ({segments.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSegment}>
            <Plus className="w-4 h-4 mr-1" />
            Add Segment
          </Button>
        </div>

        <div className="space-y-3">
          {segments.map((segment, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-none mt-2">
                  <GripVertical className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <Input
                      value={segment.name}
                      onChange={(e) => updateSegment(index, 'name', e.target.value)}
                      placeholder="Segment name (e.g., Ski Erg)"
                      required
                      className="flex-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={segment.durationMinutes || ''}
                        onChange={(e) => updateSegment(index, 'durationMinutes', parseFloat(e.target.value) || 0)}
                        placeholder="20"
                        required
                        min="0"
                        step="0.5"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Zone/Intensity</Label>
                      <Input
                        value={segment.zone || ''}
                        onChange={(e) => updateSegment(index, 'zone', e.target.value)}
                        placeholder="Zone 2"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">YouTube Video ID (optional)</Label>
                    <Input
                      value={segment.videoId || ''}
                      onChange={(e) => updateSegment(index, 'videoId', e.target.value)}
                      placeholder="e.g., P7qpoJmX91I"
                      className="mt-1"
                    />
                  </div>
                </div>

                {segments.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSegment(index)}
                    className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <Label>Equipment Needed</Label>
        <div className="flex gap-2 flex-wrap mt-2 mb-3">
          {equipment.map((item) => (
            <Badge
              key={item}
              variant="default"
              className="cursor-pointer gap-1"
              onClick={() => toggleEquipment(item)}
            >
              {item}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {COMMON_EQUIPMENT.filter(e => !equipment.includes(e)).map((item) => (
            <Badge
              key={item}
              variant="outline"
              className="cursor-pointer hover:bg-slate-100"
              onClick={() => toggleEquipment(item)}
            >
              + {item}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            value={customEquipment}
            onChange={(e) => setCustomEquipment(e.target.value)}
            placeholder="Custom equipment..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomEquipment();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addCustomEquipment}>
            Add
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Coach Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Maintain steady Zone 2 pace throughout"
          rows={3}
          className="mt-1"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          {exercise ? 'Update Block' : 'Add Block'}
        </Button>
      </div>
    </form>
  );
}
