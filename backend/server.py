from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from data.clans import CLANS, get_proficiency_bonus, get_level_from_xp, get_xp_for_next_level
from data.classes import CLASSES


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class Attributes(BaseModel):
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int

class CharacterDescription(BaseModel):
    name: str
    age: Optional[int] = None
    rank: str = ""
    title: str = ""
    appearance: str = ""
    personality_traits: str = ""
    ideals: str = ""
    bonds: str = ""
    flaws: str = ""

class EquipmentItem(BaseModel):
    name: str
    quantity: int = 1

class Jutsu(BaseModel):
    name: str
    details: str = ""

class Note(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Character(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    share_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    clan_id: str
    class_id: str
    level: int = 1
    xp: int = 0
    
    # Atributos
    attributes: Attributes
    
    # Descrição
    description: CharacterDescription
    
    # Equipamentos com quantidade
    equipment: List[EquipmentItem] = []
    armor: Optional[str] = None
    weapons: List[EquipmentItem] = []
    
    # Jutsus com detalhes
    jutsus: List[Jutsu] = []
    
    # Proficiências
    proficiencies: List[str] = []
    
    # Condição atual
    condition: str = "Normal"
    
    # Cálculos (podem ser editados manualmente)
    hp: int
    max_hp: int
    chakra: int
    max_chakra: int
    armor_class: int
    proficiency_bonus: int = 3
    
    # Modificadores
    modifiers: Dict[str, int]
    
    # Notas extras (múltiplas)
    notes: List[Note] = []
    extra_notes: str = ""  # Manter por compatibilidade
    
    # Metadados
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CharacterCreate(BaseModel):
    name: str
    clan_id: str
    class_id: str
    attributes: Attributes
    description: CharacterDescription
    equipment: List[EquipmentItem] = []
    armor: Optional[str] = None
    weapons: List[EquipmentItem] = []
    jutsus: List[Jutsu] = []

class CharacterUpdate(BaseModel):
    name: Optional[str] = None
    attributes: Optional[Attributes] = None
    description: Optional[CharacterDescription] = None
    equipment: Optional[List[EquipmentItem]] = None
    armor: Optional[str] = None
    weapons: Optional[List[EquipmentItem]] = None
    jutsus: Optional[List[Jutsu]] = None
    proficiencies: Optional[List[str]] = None
    condition: Optional[str] = None
    level: Optional[int] = None
    xp: Optional[int] = None
    hp: Optional[int] = None
    max_hp: Optional[int] = None
    chakra: Optional[int] = None
    max_chakra: Optional[int] = None
    armor_class: Optional[int] = None
    proficiency_bonus: Optional[int] = None
    notes: Optional[List[Note]] = None
    extra_notes: Optional[str] = None

class XPUpdate(BaseModel):
    xp: int

class QuickStatsUpdate(BaseModel):
    hp: Optional[int] = None
    chakra: Optional[int] = None


def migrate_character_data(character: dict) -> dict:
    """Migra dados de personagem do formato antigo para o novo"""
    # Migrar equipamentos
    if 'equipment' in character and character['equipment']:
        new_equipment = []
        for item in character['equipment']:
            if isinstance(item, str):
                new_equipment.append({"name": item, "quantity": 1})
            else:
                new_equipment.append(item)
        character['equipment'] = new_equipment
    
    # Migrar armas
    if 'weapons' in character and character['weapons']:
        new_weapons = []
        for item in character['weapons']:
            if isinstance(item, str):
                new_weapons.append({"name": item, "quantity": 1})
            else:
                new_weapons.append(item)
        character['weapons'] = new_weapons
    
    # Migrar jutsus
    if 'jutsus' in character and character['jutsus']:
        new_jutsus = []
        for jutsu in character['jutsus']:
            if isinstance(jutsu, str):
                new_jutsus.append({"name": jutsu, "details": ""})
            else:
                new_jutsus.append(jutsu)
        character['jutsus'] = new_jutsus
    
    # Adicionar campos novos se não existirem
    if 'max_hp' not in character:
        character['max_hp'] = character.get('hp', 0)
    if 'max_chakra' not in character:
        character['max_chakra'] = character.get('chakra', 0)
    if 'extra_notes' not in character:
        character['extra_notes'] = ""
    if 'notes' not in character:
        character['notes'] = []
    if 'proficiencies' not in character:
        character['proficiencies'] = []
    if 'condition' not in character:
        character['condition'] = "Normal"
    
    # Atualizar descrição com novos campos
    if 'description' in character and isinstance(character['description'], dict):
        if 'age' not in character['description']:
            character['description']['age'] = None
        if 'rank' not in character['description']:
            character['description']['rank'] = ""
        if 'title' not in character['description']:
            character['description']['title'] = ""
    
    return character


# Helper functions
def calculate_modifier(score: int) -> int:
    """Calcula o modificador baseado na pontuação de atributo"""
    return (score - 10) // 2

def calculate_character_stats(char_data: dict, clan: dict, char_class: dict, level: int = 1) -> dict:
    """Calcula HP, Chakra, CA e modificadores"""
    attrs = char_data['attributes']
    
    # Calcular modificadores
    modifiers = {
        'strength': calculate_modifier(attrs['strength']),
        'dexterity': calculate_modifier(attrs['dexterity']),
        'constitution': calculate_modifier(attrs['constitution']),
        'intelligence': calculate_modifier(attrs['intelligence']),
        'wisdom': calculate_modifier(attrs['wisdom']),
        'charisma': calculate_modifier(attrs['charisma'])
    }
    
    # Calcular HP (dado de vida + modificador de constituição) * nível
    hit_die_value = int(char_class['hit_die'].split('d')[1])
    hp = (hit_die_value + modifiers['constitution']) * level
    hp = max(1, hp)
    
    # Calcular Chakra (dado de chakra + modificador de constituição) * nível
    chakra_die_value = int(char_class['chakra_die'].split('d')[1])
    chakra = (chakra_die_value + modifiers['constitution']) * level
    chakra = max(1, chakra)
    
    # Calcular CA: 10 + mod_destreza + metade do bônus de proficiência
    proficiency_bonus = get_proficiency_bonus(level)
    armor_class = 10 + modifiers['dexterity'] + (proficiency_bonus // 2)
    
    return {
        'hp': hp,
        'max_hp': hp,
        'chakra': chakra,
        'max_chakra': chakra,
        'armor_class': armor_class,
        'proficiency_bonus': proficiency_bonus,
        'modifiers': modifiers
    }


# Routes
@api_router.get("/")
async def root():
    return {"message": "Naruto RPG Character Creator API"}

# Clan routes
@api_router.get("/clans")
async def get_clans():
    """Retorna todos os clãs disponíveis"""
    return CLANS

@api_router.get("/clans/{clan_id}")
async def get_clan(clan_id: str):
    """Retorna um clã específico"""
    clan = next((c for c in CLANS if c['id'] == clan_id), None)
    if not clan:
        raise HTTPException(status_code=404, detail="Clã não encontrado")
    return clan

# Class routes
@api_router.get("/classes")
async def get_classes():
    """Retorna todas as classes disponíveis"""
    return CLASSES

@api_router.get("/classes/{class_id}")
async def get_class(class_id: str):
    """Retorna uma classe específica"""
    char_class = next((c for c in CLASSES if c['id'] == class_id), None)
    if not char_class:
        raise HTTPException(status_code=404, detail="Classe não encontrada")
    return char_class

# Character routes
@api_router.post("/characters", response_model=Character)
async def create_character(input: CharacterCreate):
    """Cria um novo personagem"""
    # Validar clã e classe
    clan = next((c for c in CLANS if c['id'] == input.clan_id), None)
    if not clan:
        raise HTTPException(status_code=404, detail="Clã não encontrado")
    
    char_class = next((c for c in CLASSES if c['id'] == input.class_id), None)
    if not char_class:
        raise HTTPException(status_code=404, detail="Classe não encontrada")
    
    # Criar dicionário base
    char_dict = input.model_dump()
    
    # Calcular estatísticas
    stats = calculate_character_stats(char_dict, clan, char_class)
    char_dict.update(stats)
    char_dict['level'] = 1
    char_dict['xp'] = 0
    
    # Criar objeto Character
    character = Character(**char_dict)
    
    # Salvar no MongoDB
    doc = character.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.characters.insert_one(doc)
    
    logger.info(f"Personagem criado: {character.name} (ID: {character.id})")
    return character

@api_router.get("/characters", response_model=List[Character])
async def get_characters():
    """Lista todos os personagens"""
    characters = await db.characters.find({}, {"_id": 0}).to_list(1000)
    
    # Converter timestamps e migrar formato
    for char in characters:
        if isinstance(char.get('created_at'), str):
            char['created_at'] = datetime.fromisoformat(char['created_at'])
        if isinstance(char.get('updated_at'), str):
            char['updated_at'] = datetime.fromisoformat(char['updated_at'])
        
        migrate_character_data(char)
    
    return characters

@api_router.get("/characters/{character_id}", response_model=Character)
async def get_character(character_id: str):
    """Busca um personagem específico"""
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    if not character:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    # Converter timestamps
    if isinstance(character.get('created_at'), str):
        character['created_at'] = datetime.fromisoformat(character['created_at'])
    if isinstance(character.get('updated_at'), str):
        character['updated_at'] = datetime.fromisoformat(character['updated_at'])
    
    migrate_character_data(character)
    
    return character

@api_router.put("/characters/{character_id}", response_model=Character)
async def update_character(character_id: str, input: CharacterUpdate):
    """Atualiza um personagem existente"""
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    if not character:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    # Atualizar campos
    update_data = input.model_dump(exclude_unset=True)
    
    # Se atributos ou nível foram atualizados, recalcular stats (a menos que sejam editados manualmente)
    if 'attributes' in update_data or 'level' in update_data:
        # Verificar se HP, Chakra ou CA foram editados manualmente
        manual_override = False
        if 'hp' in update_data or 'chakra' in update_data or 'armor_class' in update_data:
            manual_override = True
        
        if not manual_override:
            clan = next((c for c in CLANS if c['id'] == character['clan_id']), None)
            char_class = next((c for c in CLASSES if c['id'] == character['class_id']), None)
            
            temp_char = {**character, **update_data}
            new_level = update_data.get('level', character.get('level', 1))
            stats = calculate_character_stats(temp_char, clan, char_class, new_level)
            
            # Só atualiza stats que não foram editados manualmente
            if 'hp' not in update_data:
                update_data['hp'] = stats['hp']
                update_data['max_hp'] = stats['max_hp']
            if 'chakra' not in update_data:
                update_data['chakra'] = stats['chakra']
                update_data['max_chakra'] = stats['max_chakra']
            if 'armor_class' not in update_data:
                update_data['armor_class'] = stats['armor_class']
            if 'proficiency_bonus' not in update_data:
                update_data['proficiency_bonus'] = stats['proficiency_bonus']
            
            update_data['modifiers'] = stats['modifiers']
    
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.characters.update_one(
        {"id": character_id},
        {"$set": update_data}
    )
    
    # Buscar personagem atualizado
    updated_character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    # Converter timestamps
    if isinstance(updated_character.get('created_at'), str):
        updated_character['created_at'] = datetime.fromisoformat(updated_character['created_at'])
    if isinstance(updated_character.get('updated_at'), str):
        updated_character['updated_at'] = datetime.fromisoformat(updated_character['updated_at'])
    
    logger.info(f"Personagem atualizado: {character_id}")
    return updated_character

@api_router.delete("/characters/{character_id}")
async def delete_character(character_id: str):
    """Deleta um personagem"""
    result = await db.characters.delete_one({"id": character_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    logger.info(f"Personagem deletado: {character_id}")
    return {"message": "Personagem deletado com sucesso"}

@api_router.get("/characters/share/{share_id}", response_model=Character)
async def get_shared_character(share_id: str):
    """Busca um personagem compartilhado via share_id"""
    character = await db.characters.find_one({"share_id": share_id}, {"_id": 0})
    
    if not character:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    # Converter timestamps
    if isinstance(character.get('created_at'), str):
        character['created_at'] = datetime.fromisoformat(character['created_at'])
    if isinstance(character.get('updated_at'), str):
        character['updated_at'] = datetime.fromisoformat(character['updated_at'])
    
    migrate_character_data(character)
    
    return character

@api_router.put("/characters/{character_id}/xp", response_model=Character)
async def update_character_xp(character_id: str, input: XPUpdate):
    """Atualiza XP do personagem e recalcula nível se necessário"""
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    if not character:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    new_xp = input.xp
    new_level = get_level_from_xp(new_xp)
    old_level = character.get('level', 1)
    
    update_data = {
        'xp': new_xp,
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Se o nível mudou, recalcular stats
    if new_level != old_level:
        update_data['level'] = new_level
        update_data['proficiency_bonus'] = get_proficiency_bonus(new_level)
        
        clan = next((c for c in CLANS if c['id'] == character['clan_id']), None)
        char_class = next((c for c in CLASSES if c['id'] == character['class_id']), None)
        
        if clan and char_class:
            temp_char = {**character, 'level': new_level}
            stats = calculate_character_stats(temp_char, clan, char_class, new_level)
            
            # Atualizar max_hp e max_chakra
            update_data['max_hp'] = stats['max_hp']
            update_data['max_chakra'] = stats['max_chakra']
            
            # Se HP/Chakra atual for maior que o novo máximo, ajustar
            if character.get('hp', 0) > stats['max_hp']:
                update_data['hp'] = stats['max_hp']
            if character.get('chakra', 0) > stats['max_chakra']:
                update_data['chakra'] = stats['max_chakra']
            
            update_data['armor_class'] = stats['armor_class']
            update_data['modifiers'] = stats['modifiers']
    
    await db.characters.update_one(
        {"id": character_id},
        {"$set": update_data}
    )
    
    # Buscar personagem atualizado
    updated_character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    # Converter timestamps e migrar
    if isinstance(updated_character.get('created_at'), str):
        updated_character['created_at'] = datetime.fromisoformat(updated_character['created_at'])
    if isinstance(updated_character.get('updated_at'), str):
        updated_character['updated_at'] = datetime.fromisoformat(updated_character['updated_at'])
    
    migrate_character_data(updated_character)
    
    logger.info(f"XP atualizado: {character_id}, Nível: {new_level}")
    return updated_character

@api_router.patch("/characters/{character_id}/quick-stats")
async def update_quick_stats(character_id: str, input: QuickStatsUpdate):
    """Atualiza HP e/ou Chakra rapidamente"""
    character = await db.characters.find_one({"id": character_id}, {"_id": 0})
    
    if not character:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    
    update_data = {'updated_at': datetime.now(timezone.utc).isoformat()}
    
    if input.hp is not None:
        update_data['hp'] = max(0, input.hp)
    if input.chakra is not None:
        update_data['chakra'] = max(0, input.chakra)
    
    await db.characters.update_one(
        {"id": character_id},
        {"$set": update_data}
    )
    
    return {"success": True, "message": "Stats atualizados"}

@api_router.post("/roll-dice")
async def roll_dice(dice_type: str = "d6", count: int = 1):
    """Simula rolagem de dados (usado para validação de valores)"""
    import random
    
    if dice_type not in ["d4", "d6", "d8", "d10", "d12", "d20"]:
        raise HTTPException(status_code=400, detail="Tipo de dado inválido")
    
    if count < 1 or count > 10:
        raise HTTPException(status_code=400, detail="Quantidade de dados inválida (1-10)")
    
    die_value = int(dice_type[1:])
    rolls = [random.randint(1, die_value) for _ in range(count)]
    
    return {
        "dice_type": dice_type,
        "count": count,
        "rolls": rolls,
        "total": sum(rolls)
    }

@api_router.get("/conditions")
async def get_conditions():
    """Retorna a lista de condições disponíveis"""
    from data.conditions import CONDITIONS
    return CONDITIONS

@api_router.get("/xp-table")
async def get_xp_table():
    """Retorna a tabela de XP por nível"""
    from data.clans import XP_TABLE
    return XP_TABLE


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()