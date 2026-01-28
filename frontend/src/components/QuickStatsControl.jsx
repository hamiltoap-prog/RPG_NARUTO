import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Sparkles, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuickStatsControl = ({ character, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [hp, setHp] = useState(character.hp);
  const [chakra, setChakra] = useState(character.chakra);
  const [condition, setCondition] = useState(character.condition || "Normal");
  const [conditions, setConditions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await axios.get(`${API}/conditions`);
      setConditions(response.data);
    } catch (error) {
      console.error('Erro ao buscar condições:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/characters/${character.id}/quick-stats`, {
        hp: parseInt(hp),
        chakra: parseInt(chakra)
      });
      
      // Update condition separately if changed
      if (condition !== character.condition) {
        await axios.put(`${API}/characters/${character.id}`, {
          condition: condition
        });
      }
      
      toast.success('Stats atualizados');
      setEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar stats:', error);
      toast.error('Erro ao atualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setHp(character.hp);
    setChakra(character.chakra);
    setCondition(character.condition || "Normal");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-400" />
            <span className="font-mono text-white">{character.hp}/{character.max_hp}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="font-mono text-white">{character.chakra}/{character.max_chakra}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={condition}
            onValueChange={async (value) => {
              try {
                await axios.put(`${API}/characters/${character.id}`, { condition: value });
                setCondition(value);
                toast.success('Condição atualizada');
                if (onUpdate) onUpdate();
              } catch (error) {
                console.error('Erro:', error);
                toast.error('Erro ao atualizar condição');
              }
            }}
          >
            <SelectTrigger className="h-7 text-xs bg-slate-900/50 border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((cond) => (
                <SelectItem key={cond} value={cond}>
                  {cond}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="h-7 px-2 text-[10px]"
            data-testid={`quick-edit-${character.id}`}
          >
            Editar HP/Chakra
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Heart className="h-3 w-3 text-red-400" />
          <Input
            type="number"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="h-7 w-14 px-2 text-xs bg-slate-900/50 border-slate-800"
            disabled={saving}
          />
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-blue-400" />
          <Input
            type="number"
            value={chakra}
            onChange={(e) => setChakra(e.target.value)}
            className="h-7 w-14 px-2 text-xs bg-slate-900/50 border-slate-800"
            disabled={saving}
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          disabled={saving}
          className="h-6 w-6 p-0 text-green-400"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={saving}
          className="h-6 w-6 p-0 text-red-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuickStatsControl;
