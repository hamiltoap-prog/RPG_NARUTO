import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Save, Plus, Minus, X, Loader, FileText } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdvancedEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [clan, setClan] = useState(null);
  const [charClass, setCharClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [xpTable, setXpTable] = useState({});
  const [conditions, setConditions] = useState([]);
  
  // New item states
  const [newEquipment, setNewEquipment] = useState('');
  const [newWeapon, setNewWeapon] = useState('');
  const [newJutsuName, setNewJutsuName] = useState('');
  const [newJutsuDetails, setNewJutsuDetails] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newProficiency, setNewProficiency] = useState('');

  useEffect(() => {
    fetchCharacter();
    fetchXPTable();
    fetchConditions();
  }, [id]);

  const fetchConditions = async () => {
    try {
      const response = await axios.get(`${API}/conditions`);
      setConditions(response.data);
    } catch (error) {
      console.error('Erro ao buscar condições:', error);
    }
  };

  const fetchXPTable = async () => {
    try {
      const response = await axios.get(`${API}/xp-table`);
      setXpTable(response.data);
    } catch (error) {
      console.error('Erro ao buscar tabela XP:', error);
    }
  };

  const fetchCharacter = async () => {
    try {
      const charRes = await axios.get(`${API}/characters/${id}`);
      setCharacter(charRes.data);

      const [clanRes, classRes] = await Promise.all([
        axios.get(`${API}/clans/${charRes.data.clan_id}`),
        axios.get(`${API}/classes/${charRes.data.class_id}`)
      ]);
      setClan(clanRes.data);
      setCharClass(classRes.data);
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      toast.error('Erro ao carregar personagem');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/characters/${id}`, character);
      toast.success('Personagem atualizado com sucesso!');
      navigate(`/character/${id}`);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleXPChange = async (newXP) => {
    try {
      const response = await axios.put(`${API}/characters/${id}/xp`, { xp: newXP });
      setCharacter(response.data);
      
      if (response.data.level !== character.level) {
        toast.success(`Parabéns! Subiu para o nível ${response.data.level}!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar XP:', error);
      toast.error('Erro ao atualizar XP');
    }
  };

  const updateEquipmentQuantity = (index, delta) => {
    const newEquipment = [...character.equipment];
    newEquipment[index].quantity = Math.max(1, newEquipment[index].quantity + delta);
    setCharacter({ ...character, equipment: newEquipment });
  };

  const updateWeaponQuantity = (index, delta) => {
    const newWeapons = [...character.weapons];
    newWeapons[index].quantity = Math.max(1, newWeapons[index].quantity + delta);
    setCharacter({ ...character, weapons: newWeapons });
  };

  const removeEquipment = (index) => {
    const newEquipment = character.equipment.filter((_, i) => i !== index);
    setCharacter({ ...character, equipment: newEquipment });
  };

  const removeWeapon = (index) => {
    const newWeapons = character.weapons.filter((_, i) => i !== index);
    setCharacter({ ...character, weapons: newWeapons });
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      const equipment = [...(character.equipment || []), { name: newEquipment.trim(), quantity: 1 }];
      setCharacter({ ...character, equipment });
      setNewEquipment('');
      toast.success('Equipamento adicionado');
    }
  };

  const addWeapon = () => {
    if (newWeapon.trim()) {
      const weapons = [...(character.weapons || []), { name: newWeapon.trim(), quantity: 1 }];
      setCharacter({ ...character, weapons });
      setNewWeapon('');
      toast.success('Arma adicionada');
    }
  };

  const addJutsu = () => {
    if (newJutsuName.trim()) {
      const jutsus = [...(character.jutsus || []), { name: newJutsuName.trim(), details: newJutsuDetails.trim() }];
      setCharacter({ ...character, jutsus });
      setNewJutsuName('');
      setNewJutsuDetails('');
      toast.success('Jutsu adicionado');
    }
  };

  const removeJutsu = (index) => {
    const newJutsus = character.jutsus.filter((_, i) => i !== index);
    setCharacter({ ...character, jutsus: newJutsus });
  };

  const addProficiency = () => {
    if (newProficiency.trim()) {
      const proficiencies = [...(character.proficiencies || []), newProficiency.trim()];
      setCharacter({ ...character, proficiencies });
      setNewProficiency('');
      toast.success('Proficiência adicionada');
    }
  };

  const removeProficiency = (index) => {
    const newProfs = character.proficiencies.filter((_, i) => i !== index);
    setCharacter({ ...character, proficiencies: newProfs });
  };

  const addNote = () => {
    if (newNote.trim()) {
      const notes = [...(character.notes || []), {
        id: Date.now().toString(),
        content: newNote.trim(),
        created_at: new Date().toISOString()
      }];
      setCharacter({ ...character, notes });
      setNewNote('');
      toast.success('Nota adicionada');
    }
  };

  const removeNote = (noteId) => {
    const notes = character.notes.filter(n => n.id !== noteId);
    setCharacter({ ...character, notes });
  };

  const getXPForNextLevel = () => {
    if (character.level >= 20) return xpTable[20] || 0;
    return xpTable[character.level + 1] || 0;
  };

  const getXPProgress = () => {
    const currentLevelXP = xpTable[character.level] || 0;
    const nextLevelXP = getXPForNextLevel();
    const xpInLevel = character.xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    return (xpInLevel / xpNeeded) * 100;
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(249, 115, 22);
    pdf.text(character.name, 20, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${clan?.name} • ${charClass?.name} • Nível ${character.level}`, 20, 30);
    pdf.text(`XP: ${character.xp} / ${getXPForNextLevel()}`, 20, 37);
    
    // Stats
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Estatísticas', 20, 50);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(11);
    pdf.text(`HP: ${character.hp}/${character.max_hp}`, 20, 57);
    pdf.text(`Chakra: ${character.chakra}/${character.max_chakra}`, 70, 57);
    pdf.text(`CA: ${character.armor_class}`, 135, 57);
    pdf.text(`Proficiência: +${character.proficiency_bonus}`, 165, 57);
    
    let yPos = 72;
    
    // Equipment
    if (character.equipment && character.equipment.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Equipamentos', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      
      character.equipment.forEach((item) => {
        pdf.text(`• ${item.name} (x${item.quantity})`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Weapons
    if (character.weapons && character.weapons.length > 0) {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Armas', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      
      character.weapons.forEach((item) => {
        pdf.text(`• ${item.name} (x${item.quantity})`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Jutsus
    if (character.jutsus && character.jutsus.length > 0) {
      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Jutsus', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      
      character.jutsus.forEach((jutsu) => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${jutsu}`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Notes
    if (character.notes && character.notes.length > 0) {
      if (yPos > 230) {
        pdf.addPage();
        yPos = 20;
      }
      
      yPos += 10;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Notas', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      
      character.notes.forEach((note) => {
        const lines = pdf.splitTextToSize(note.content, 170);
        lines.forEach(line => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 5;
        });
        yPos += 3;
      });
    }
    
    pdf.save(`${character.name}_ficha.pdf`);
    toast.success('PDF exportado com sucesso!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-400">Personagem não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-800 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/character/${id}`)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={exportToPDF}
                data-testid="export-pdf-btn"
              >
                Exportar PDF
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                data-testid="save-changes-btn"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <h1 className="text-3xl font-heading font-bold text-white mb-8">
          Editar <span className="text-primary">{character.name}</span>
        </h1>

        {/* Level and XP */}
        <div className="bg-card/40 border border-white/5 p-6 mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Nível e Experiência</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-slate-400 text-sm">Nível Atual</Label>
              <div className="text-4xl font-heading font-bold text-primary mt-2">
                {character.level}
              </div>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Experiência (XP)</Label>
              <Input
                type="number"
                value={character.xp}
                onChange={(e) => {
                  const newXP = parseInt(e.target.value) || 0;
                  setCharacter({...character, xp: newXP});
                }}
                onBlur={(e) => handleXPChange(parseInt(e.target.value) || 0)}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white text-lg font-mono"
                data-testid="edit-xp-input"
              />
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{character.xp} XP</span>
                  <span>Próximo: {getXPForNextLevel()} XP</span>
                </div>
                <div className="h-2 bg-slate-900/50 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${Math.min(getXPProgress(), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Fields */}
        <div className="bg-card/40 border border-white/5 p-6 mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Informações do Personagem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-slate-400 text-sm">Idade</Label>
              <Input
                type="number"
                value={character.description?.age || ''}
                onChange={(e) => setCharacter({
                  ...character,
                  description: { ...character.description, age: parseInt(e.target.value) || null }
                })}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white"
                placeholder="Ex: 16"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Rank</Label>
              <Input
                type="text"
                value={character.description?.rank || ''}
                onChange={(e) => setCharacter({
                  ...character,
                  description: { ...character.description, rank: e.target.value }
                })}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white"
                placeholder="Ex: Rank A, Rank S"
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Graduação</Label>
              <Input
                type="text"
                value={character.description?.title || ''}
                onChange={(e) => setCharacter({
                  ...character,
                  description: { ...character.description, title: e.target.value }
                })}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white"
                placeholder="Ex: Genin, Chunin, Jounin"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-400 text-sm">Aparência</Label>
              <Textarea
                value={character.description?.appearance || ''}
                onChange={(e) => setCharacter({
                  ...character,
                  description: { ...character.description, appearance: e.target.value }
                })}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white min-h-[80px]"
                placeholder="Descrição da aparência..."
              />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Personalidade</Label>
              <Textarea
                value={character.description?.personality_traits || ''}
                onChange={(e) => setCharacter({
                  ...character,
                  description: { ...character.description, personality_traits: e.target.value }
                })}
                className="mt-2 bg-slate-900/50 border-slate-800 text-white min-h-[60px]"
                placeholder="Traços de personalidade..."
              />
            </div>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/40 border border-white/5 p-4">
            <Label className="text-slate-400 text-sm">HP Atual / Máximo</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={character.hp}
                onChange={(e) => setCharacter({...character, hp: parseInt(e.target.value) || 0})}
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="edit-hp-input"
              />
              <Input
                type="number"
                value={character.max_hp}
                onChange={(e) => setCharacter({...character, max_hp: parseInt(e.target.value) || 0})}
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="edit-max-hp-input"
              />
            </div>
          </div>

          <div className="bg-card/40 border border-white/5 p-4">
            <Label className="text-slate-400 text-sm">Chakra Atual / Máximo</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={character.chakra}
                onChange={(e) => setCharacter({...character, chakra: parseInt(e.target.value) || 0})}
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="edit-chakra-input"
              />
              <Input
                type="number"
                value={character.max_chakra}
                onChange={(e) => setCharacter({...character, max_chakra: parseInt(e.target.value) || 0})}
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="edit-max-chakra-input"
              />
            </div>
          </div>

          <div className="bg-card/40 border border-white/5 p-4">
            <Label className="text-slate-400 text-sm">CA</Label>
            <Input
              type="number"
              value={character.armor_class}
              onChange={(e) => setCharacter({...character, armor_class: parseInt(e.target.value) || 10})}
              className="mt-2 bg-slate-900/50 border-slate-800 text-white"
              data-testid="edit-ac-input"
            />
          </div>
        </div>

        {/* Equipment with quantities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card/40 border border-white/5 p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Equipamentos</h3>
            
            {/* Add new equipment */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                placeholder="Adicionar equipamento..."
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="new-equipment-input"
              />
              <Button onClick={addEquipment} variant="secondary" size="sm">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {character.equipment && character.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3 py-2">
                  <span className="flex-1 text-slate-300">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateEquipmentQuantity(index, -1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-mono text-white">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateEquipmentQuantity(index, 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeEquipment(index)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/40 border border-white/5 p-6">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Armas</h3>
            
            {/* Add new weapon */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newWeapon}
                onChange={(e) => setNewWeapon(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWeapon()}
                placeholder="Adicionar arma..."
                className="bg-slate-900/50 border-slate-800 text-white"
                data-testid="new-weapon-input"
              />
              <Button onClick={addWeapon} variant="secondary" size="sm">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {character.weapons && character.weapons.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3 py-2">
                  <span className="flex-1 text-slate-300">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateWeaponQuantity(index, -1)}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-mono text-white">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateWeaponQuantity(index, 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeWeapon(index)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Condition Selection */}
        <div className="bg-card/40 border border-white/5 p-6 mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Condição Atual</h3>
          <Select
            value={character.condition || "Normal"}
            onValueChange={(value) => setCharacter({...character, condition: value})}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white">
              <SelectValue placeholder="Selecione a condição" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jutsus */}
        <div className="bg-card/40 border border-white/5 p-6 mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Jutsus</h3>
          
          {/* Add new jutsu */}
          <div className="space-y-3 mb-4">
            <Input
              value={newJutsuName}
              onChange={(e) => setNewJutsuName(e.target.value)}
              placeholder="Nome do jutsu..."
              className="bg-slate-900/50 border-slate-800 text-white"
              data-testid="new-jutsu-name-input"
            />
            <Textarea
              value={newJutsuDetails}
              onChange={(e) => setNewJutsuDetails(e.target.value)}
              placeholder="Detalhes do jutsu (como funciona, rank, custo de chakra, etc)..."
              className="bg-slate-900/50 border-slate-800 text-white min-h-[80px]"
              data-testid="new-jutsu-details-input"
            />
            <Button onClick={addJutsu} variant="secondary" className="w-full">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Jutsu
            </Button>
          </div>
          
          <div className="space-y-3">
            {character.jutsus && character.jutsus.map((jutsu, index) => {
              const jutsuData = typeof jutsu === 'string' ? { name: jutsu, details: '' } : jutsu;
              return (
                <div key={index} className="bg-slate-900/50 border border-slate-800 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold">{jutsuData.name}</h4>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeJutsu(index)}
                      className="h-7 w-7 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {jutsuData.details && (
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{jutsuData.details}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Proficiencies */}
        <div className="bg-card/40 border border-white/5 p-6 mb-8">
          <h3 className="text-xl font-heading font-bold text-white mb-4">Proficiências</h3>
          
          {/* Add new proficiency */}
          <div className="flex gap-2 mb-4">
            <Input
              value={newProficiency}
              onChange={(e) => setNewProficiency(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProficiency()}
              placeholder="Adicionar proficiência (ex: Percepção, Furtividade)..."
              className="bg-slate-900/50 border-slate-800 text-white"
              data-testid="new-proficiency-input"
            />
            <Button onClick={addProficiency} variant="secondary" size="sm">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {character.proficiencies && character.proficiencies.map((prof, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 text-slate-300"
              >
                <span>{prof}</span>
                <button
                  onClick={() => removeProficiency(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card/40 border border-white/5 p-6">
          <h3 className="text-xl font-heading font-bold text-white mb-4">
            <FileText className="inline h-5 w-5 mr-2" />
            Notas e Anotações
          </h3>
          
          {/* Add new note */}
          <div className="flex gap-2 mb-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Adicionar nota, conquista, missão..."
              className="bg-slate-900/50 border-slate-800 text-white min-h-[60px]"
              data-testid="new-note-textarea"
            />
            <Button onClick={addNote} variant="secondary" size="sm">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {character.notes && character.notes.map((note) => (
              <div key={note.id} className="bg-slate-900/50 border border-slate-800 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-500">
                    {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeNote(note.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-slate-300 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEdit;
