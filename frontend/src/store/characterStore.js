import { create } from 'zustand';

const useCharacterStore = create((set) => ({
  // Dados do personagem em criação
  currentStep: 1,
  character: {
    name: '',
    clan_id: '',
    class_id: '',
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    description: {
      name: '',
      appearance: '',
      personality_traits: '',
      ideals: '',
      bonds: '',
      flaws: ''
    },
    equipment: [],
    armor: null,
    weapons: [],
    jutsus: []
  },

  // Ações
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateCharacter: (updates) => set((state) => ({
    character: { ...state.character, ...updates }
  })),

  updateAttributes: (attributes) => set((state) => ({
    character: {
      ...state.character,
      attributes: { ...state.character.attributes, ...attributes }
    }
  })),

  updateDescription: (description) => set((state) => ({
    character: {
      ...state.character,
      description: { ...state.character.description, ...description }
    }
  })),

  resetCharacter: () => set({
    currentStep: 1,
    character: {
      name: '',
      clan_id: '',
      class_id: '',
      attributes: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      description: {
        name: '',
        appearance: '',
        personality_traits: '',
        ideals: '',
        bonds: '',
        flaws: ''
      },
      equipment: [],
      armor: null,
      weapons: [],
      jutsus: []
    }
  }),

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, 7)
  })),

  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  }))
}));

export default useCharacterStore;
