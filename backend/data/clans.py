# Dados dos Clãs do Naruto RPG
CLANS = [
    {
        "id": "sem_cla",
        "name": "Sem Clã",
        "description": "Não pertence a nenhuma linhagem nobre, mas possui potencial ilimitado pela vontade humana.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": [],
        "proficiencies": []
    },
    {
        "id": "uchiha",
        "name": "Uchiha",
        "description": "Clã lendário conhecido pelo Sharingan, que concede habilidades visuais únicas.",
        "bonuses": {
            "strength": 0,
            "dexterity": 2,
            "constitution": 0,
            "intelligence": 1,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Sharingan"],
        "proficiencies": ["Ninjutsu", "Genjutsu"]
    },
    {
        "id": "hyuga",
        "name": "Hyūga",
        "description": "Clã nobre de Konoha, mestres do Byakugan e do estilo de luta Juken.",
        "bonuses": {
            "strength": 0,
            "dexterity": 1,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 2,
            "charisma": 0
        },
        "special_abilities": ["Byakugan", "Juken"],
        "proficiencies": ["Taijutsu", "Percepção"]
    },
    {
        "id": "uzumaki",
        "name": "Uzumaki",
        "description": "Clã conhecido por sua vitalidade excepcional e maestria em selos.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 2,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Vitalidade Excepcional", "Maestria em Fuinjutsu"],
        "proficiencies": ["Ninjutsu"]
    },
    {
        "id": "nara",
        "name": "Nara",
        "description": "Clã de estrategistas brilhantes, conhecidos por manipular sombras.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 2,
            "wisdom": 0,
            "charisma": 1
        },
        "special_abilities": ["Manipulação de Sombras"],
        "proficiencies": ["História", "Investigação"]
    },
    {
        "id": "akimichi",
        "name": "Akimichi",
        "description": "Clã capaz de manipular o tamanho de seu corpo convertendo calorias em chakra.",
        "bonuses": {
            "strength": 1,
            "dexterity": 0,
            "constitution": 2,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Expansão Corporal"],
        "proficiencies": ["Taijutsu"]
    },
    {
        "id": "yamanaka",
        "name": "Yamanaka",
        "description": "Clã especializado em técnicas de transferência mental e manipulação de mentes.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 1,
            "wisdom": 0,
            "charisma": 2
        },
        "special_abilities": ["Transferência Mental"],
        "proficiencies": ["Genjutsu", "Intuição"]
    },
    {
        "id": "inuzuka",
        "name": "Inuzuka",
        "description": "Clã que luta ao lado de cães ninjas companheiros, com sentidos aguçados.",
        "bonuses": {
            "strength": 1,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 2,
            "charisma": 0
        },
        "special_abilities": ["Companheiro Canino"],
        "proficiencies": ["Lidar com Animais", "Sobrevivência"]
    },
    {
        "id": "aburame",
        "name": "Aburame",
        "description": "Clã que hospeda insetos especiais em seus corpos, usando-os em combate.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 0,
            "wisdom": 1,
            "charisma": 2
        },
        "special_abilities": ["Controle de Insetos"],
        "proficiencies": ["Natureza", "Furtividade"]
    },
    {
        "id": "hatake",
        "name": "Hatake",
        "description": "Clã raro conhecido por produzir ninjas excepcionalmente talentosos.",
        "bonuses": {
            "strength": 0,
            "dexterity": 0,
            "constitution": 0,
            "intelligence": 2,
            "wisdom": 0,
            "charisma": 1
        },
        "special_abilities": ["Talento Natural"],
        "proficiencies": ["Ninjutsu", "Bukijutsu"]
    },
    {
        "id": "sarutobi",
        "name": "Sarutobi",
        "description": "Clã versátil conhecido por dominar múltiplos estilos de combate.",
        "bonuses": {
            "strength": 2,
            "dexterity": 0,
            "constitution": 1,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Versatilidade Ninja"],
        "proficiencies": ["Taijutsu", "Bukijutsu"]
    },
    {
        "id": "kaguya",
        "name": "Kaguya",
        "description": "Clã selvagem capaz de manipular sua estrutura óssea.",
        "bonuses": {
            "strength": 2,
            "dexterity": 2,
            "constitution": 1,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Shikotsumyaku"],
        "proficiencies": ["Taijutsu"]
    },
    {
        "id": "hoshigaki",
        "name": "Hoshigaki",
        "description": "Clã com características de tubarão, força brutal e afinidade com água.",
        "bonuses": {
            "strength": 1,
            "dexterity": 0,
            "constitution": 2,
            "intelligence": 0,
            "wisdom": 0,
            "charisma": 0
        },
        "special_abilities": ["Fisiologia de Tubarão"],
        "proficiencies": ["Ninjutsu", "Atletismo"]
    }
]


# Cálculo de proficiência por nível (corrigido conforme PDF)
def get_proficiency_bonus(level):
    """Retorna o bônus de proficiência baseado no nível"""
    if level <= 4:
        return 3
    elif level <= 8:
        return 4
    elif level <= 11:
        return 5
    elif level <= 16:
        return 6
    elif level <= 20:
        return 7
    else:
        return 8

# Tabela de XP por nível
XP_TABLE = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000
}

def get_level_from_xp(xp):
    """Retorna o nível baseado no XP atual"""
    level = 1
    for lvl in range(20, 0, -1):
        if xp >= XP_TABLE[lvl]:
            level = lvl
            break
    return level

def get_xp_for_next_level(current_level):
    """Retorna o XP necessário para o próximo nível"""
    if current_level >= 20:
        return XP_TABLE[20]
    return XP_TABLE[current_level + 1]
