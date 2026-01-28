import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCharacterStore from '@/store/characterStore';
import WizardLayout from './WizardLayout';
import Step1Clan from './wizard/Step1Clan';
import Step2Class from './wizard/Step2Class';
import Step3Attributes from './wizard/Step3Attributes';
import Step4Description from './wizard/Step4Description';
import Step5Equipment from './wizard/Step5Equipment';
import Step6Jutsus from './wizard/Step6Jutsus';
import Step7EditSummary from './wizard/Step7EditSummary';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EditCharacter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStep, updateCharacter, updateAttributes, updateDescription } = useCharacterStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      const response = await axios.get(`${API}/characters/${id}`);
      const char = response.data;

      // Populate store with existing character data
      updateCharacter({
        id: char.id,
        name: char.name,
        clan_id: char.clan_id,
        class_id: char.class_id,
        equipment: char.equipment || [],
        armor: char.armor,
        weapons: char.weapons || [],
        jutsus: char.jutsus || []
      });
      
      updateAttributes(char.attributes);
      updateDescription(char.description);
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      toast.error('Erro ao carregar personagem');
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Clan />;
      case 2:
        return <Step2Class />;
      case 3:
        return <Step3Attributes />;
      case 4:
        return <Step4Description />;
      case 5:
        return <Step5Equipment />;
      case 6:
        return <Step6Jutsus />;
      case 7:
        return <Step7EditSummary characterId={id} />;
      default:
        return <Step1Clan />;
    }
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

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
};

export default EditCharacter;
