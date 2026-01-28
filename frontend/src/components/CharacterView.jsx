import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from './ui/button';
import { ArrowLeft, Edit, Share2, Download, Heart, Sparkles, Shield, Zap, Loader, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CharacterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [clan, setClan] = useState(null);
  const [charClass, setCharClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter();
  }, [id]);

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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${character.share_id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(249, 115, 22);
    pdf.text(character.name, 20, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${clan?.name} • ${charClass?.name} • Nível ${character.level}`, 20, 30);
    
    // Stats
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Estatísticas', 20, 45);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(11);
    pdf.text(`HP: ${character.hp}${character.max_hp ? `/${character.max_hp}` : ''}`, 20, 52);
    pdf.text(`Chakra: ${character.chakra}${character.max_chakra ? `/${character.max_chakra}` : ''}`, 70, 52);
    pdf.text(`CA: ${character.armor_class}`, 135, 52);
    pdf.text(`Proficiência: +${character.proficiency_bonus}`, 165, 52);
    
    // Attributes
    let yPos = 65;
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Atributos', 20, yPos);
    yPos += 7;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(11);
    
    const attrLabels = {
      strength: 'FOR', dexterity: 'DES', constitution: 'CON',
      intelligence: 'INT', wisdom: 'SAB', charisma: 'CAR'
    };
    
    Object.entries(character.attributes).forEach(([attr, value], index) => {
      const finalValue = value + (clan?.bonuses[attr] || 0);
      const modifier = character.modifiers[attr];
      const x = 20 + (index % 3) * 60;
      const y = yPos + Math.floor(index / 3) * 7;
      pdf.text(`${attrLabels[attr]}: ${finalValue} (${modifier >= 0 ? '+' : ''}${modifier})`, x, y);
    });
    
    yPos += 20;
    
    // Equipment
    if (character.equipment && character.equipment.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Equipamentos', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      
      character.equipment.forEach((item) => {
        const itemText = typeof item === 'string' ? item : `${item.name} (x${item.quantity})`;
        pdf.text(`• ${itemText}`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Weapons
    if (character.weapons && character.weapons.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Armas', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(11);
      
      character.weapons.forEach((item) => {
        const itemText = typeof item === 'string' ? item : `${item.name} (x${item.quantity})`;
        pdf.text(`• ${itemText}`, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }
    
    // Jutsus
    if (character.jutsus && character.jutsus.length > 0) {
      if (yPos > 250) {
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
    }
    
    // Extra Notes
    if (character.extra_notes && character.extra_notes.trim()) {
      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      }
      
      yPos += 10;
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Notas Extras', 20, yPos);
      yPos += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      
      const lines = pdf.splitTextToSize(character.extra_notes, 170);
      lines.forEach(line => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, 20, yPos);
        yPos += 5;
      });
    }
    
    pdf.save(`${character.name}_ficha.pdf`);
    toast.success('PDF exportado com sucesso!');
  };

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-400">Carregando personagem...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Personagem não encontrado</p>
          <Button onClick={() => navigate('/')}>Voltar ao Dashboard</Button>
        </div>
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
              onClick={() => navigate('/')}
              data-testid="back-to-dashboard-btn"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleShare}
                data-testid="share-btn"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Compartilhar
              </Button>
              <Button
                variant="secondary"
                onClick={handleExportPDF}
                data-testid="export-pdf-btn"
              >
                <Download className="mr-2 h-5 w-5" />
                Exportar PDF
              </Button>
              <Button
                onClick={() => navigate(`/edit/${character.id}`)}
                data-testid="edit-character-btn"
              >
                <Edit className="mr-2 h-5 w-5" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Character Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            {character.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-lg text-slate-300">
            <span>{clan?.name}</span>
            <span>•</span>
            <span>{charClass?.name}</span>
            <span>•</span>
            <span>Nível {character.level}</span>
            {character.description?.age && (
              <>
                <span>•</span>
                <span>{character.description.age} anos</span>
              </>
            )}
            {character.description?.rank && (
              <>
                <span>•</span>
                <span className="text-primary font-semibold">{character.description.rank}</span>
              </>
            )}
            {character.description?.title && (
              <>
                <span>•</span>
                <span className="text-accent font-semibold">{character.description.title}</span>
              </>
            )}
          </div>
          {character.condition && character.condition !== "Normal" && (
            <div className="mt-3 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-sm font-semibold">
              Condição: {character.condition}
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Heart className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.hp}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Pontos de Vida</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-blue-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.chakra}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Pontos de Chakra</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Shield className="w-10 h-10 mx-auto mb-3 text-green-500" />
            <p className="text-3xl font-mono font-bold text-white">{character.armor_class}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Classe de Armadura</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card/40 border border-white/5 p-6 text-center"
          >
            <Zap className="w-10 h-10 mx-auto mb-3 text-orange-500" />
            <p className="text-3xl font-mono font-bold text-white">+{character.proficiency_bonus}</p>
            <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">Bônus de Proficiência</p>
          </motion.div>
        </div>

        {/* Attributes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/40 border border-white/5 p-8 mb-8"
        >
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Atributos</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {Object.entries(character.modifiers).map(([attr, modifier]) => {
              const attrLabels = {
                strength: 'FOR',
                dexterity: 'DES',
                constitution: 'CON',
                intelligence: 'INT',
                wisdom: 'SAB',
                charisma: 'CAR'
              };
              const finalValue = character.attributes[attr] + (clan?.bonuses[attr] || 0);
              
              return (
                <div key={attr} className="text-center bg-slate-900/40 border border-slate-800 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                    {attrLabels[attr]}
                  </p>
                  <p className="text-3xl font-mono font-bold text-primary mb-1">{finalValue}</p>
                  <p className="text-sm text-slate-500 font-mono">
                    ({modifier >= 0 ? '+' : ''}{modifier})
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Description & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/40 border border-white/5 p-6"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Descrição</h3>
            <div className="space-y-4">
              {character.description.appearance && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Aparência</p>
                  <p className="text-slate-300">{character.description.appearance}</p>
                </div>
              )}
              {character.description.personality_traits && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Personalidade</p>
                  <p className="text-slate-300">{character.description.personality_traits}</p>
                </div>
              )}
              {character.description.ideals && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Ideais</p>
                  <p className="text-slate-300">{character.description.ideals}</p>
                </div>
              )}
              {character.description.bonds && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Vínculos</p>
                  <p className="text-slate-300">{character.description.bonds}</p>
                </div>
              )}
              {character.description.flaws && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Falhas</p>
                  <p className="text-slate-300">{character.description.flaws}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Equipment */}
            <div className="bg-card/40 border border-white/5 p-6">
              <h3 className="text-xl font-heading font-bold text-white mb-4">Equipamentos</h3>
              <div className="space-y-2">
                {character.armor && (
                  <p className="text-slate-300">• {character.armor}</p>
                )}
                {character.weapons?.map((weapon, i) => (
                  <p key={i} className="text-slate-300">
                    • {typeof weapon === 'string' ? weapon : `${weapon.name} (x${weapon.quantity})`}
                  </p>
                ))}
                {character.equipment?.map((item, i) => (
                  <p key={i} className="text-slate-300">
                    • {typeof item === 'string' ? item : `${item.name} (x${item.quantity})`}
                  </p>
                ))}
                {!character.armor && (!character.weapons || character.weapons.length === 0) && 
                 (!character.equipment || character.equipment.length === 0) && (
                  <p className="text-sm text-slate-500">Nenhum equipamento</p>
                )}
              </div>
            </div>

            {/* Jutsus */}
            <div className="bg-card/40 border border-white/5 p-6">
              <h3 className="text-xl font-heading font-bold text-white mb-4">Jutsus</h3>
              {character.jutsus && character.jutsus.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {character.jutsus.map((jutsu, i) => {
                    const jutsuData = typeof jutsu === 'string' ? { name: jutsu, details: '' } : jutsu;
                    return (
                      <AccordionItem key={i} value={`jutsu-${i}`} className="border-slate-800">
                        <AccordionTrigger className="text-slate-300 hover:text-white">
                          <span className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            {jutsuData.name}
                          </span>
                        </AccordionTrigger>
                        {jutsuData.details && (
                          <AccordionContent className="text-slate-400 text-sm pl-6">
                            {jutsuData.details}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <p className="text-sm text-slate-500">Nenhum jutsu</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Proficiencies */}
        {character.proficiencies && character.proficiencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-card/40 border border-white/5 p-6 mb-8"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Proficiências</h3>
            <div className="flex flex-wrap gap-2">
              {character.proficiencies.map((prof, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 text-sm"
                >
                  {prof}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {character.notes && character.notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-card/40 border border-white/5 p-6 mb-8"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Notas e Anotações</h3>
            <div className="space-y-3">
              {character.notes.map((note) => (
                <div key={note.id} className="bg-slate-900/50 border border-slate-800 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-slate-500">
                      {new Date(note.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Clan & Class Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-card/40 border border-white/5 p-6"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Clã: {clan?.name}</h3>
            <p className="text-slate-300 mb-4">{clan?.description}</p>
            {clan?.special_abilities && clan.special_abilities.length > 0 && (
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Habilidades Especiais
                </p>
                <div className="flex flex-wrap gap-2">
                  {clan.special_abilities.map((ability, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 uppercase tracking-wide"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card/40 border border-white/5 p-6"
          >
            <h3 className="text-xl font-heading font-bold text-white mb-4">Classe: {charClass?.name}</h3>
            <p className="text-slate-300 mb-4">{charClass?.description}</p>
            {charClass?.special_features && charClass.special_features.length > 0 && (
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Habilidades da Classe
                </p>
                <div className="flex flex-wrap gap-2">
                  {charClass.special_features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-slate-900/50 border border-slate-800 text-slate-300 uppercase tracking-wide"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CharacterView;
