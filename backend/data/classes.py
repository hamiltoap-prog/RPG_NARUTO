# Dados das Classes do Naruto RPG
CLASSES = [
    {
        "id": "genjutsu_specialist",
        "name": "Especialista em Genjutsu",
        "description": "Mestre em ilusões, focado em manipular a mente dos inimigos.",
        "hit_die": "1d8",
        "chakra_die": "1d10",
        "primary_ability": "wisdom",
        "proficiencies": {
            "armor": ["Leve"],
            "weapons": ["Armas Simples", "Kunai", "Shuriken"],
            "skills": ["Genjutsu", "Intuição", "Enganação"],
            "saving_throws": ["wisdom", "charisma"]
        },
        "starting_equipment": [
            "Colete de Couro",
            "Kunai (3x)",
            "Shuriken (10x)",
            "Kit Ninja Básico"
        ],
        "starting_wealth": "3d4 x 100 Ryo",
        "special_features": ["Ilusão Básica", "Resistência Mental"]
    },
    {
        "id": "hunter_ninja",
        "name": "Ninja Caçador",
        "description": "Assassino implacável que usa furtividade e truques para eliminar alvos.",
        "hit_die": "1d8",
        "chakra_die": "1d8",
        "primary_ability": "dexterity",
        "proficiencies": {
            "armor": ["Leve", "Média"],
            "weapons": ["Armas Simples", "Armas Marciais", "Kunai", "Tanto"],
            "skills": ["Furtividade", "Acrobacia", "Percepção"],
            "saving_throws": ["dexterity", "intelligence"]
        },
        "starting_equipment": [
            "Colete de Combate",
            "Tanto",
            "Kunai (5x)",
            "Kit de Veneno",
            "Máscara de Caçador"
        ],
        "starting_wealth": "4d4 x 100 Ryo",
        "special_features": ["Ataque Furtivo", "Conhecimento Anatômico"]
    },
    {
        "id": "strategist",
        "name": "Mestre Estrategista",
        "description": "Comandante tático que usa astúcia e engenhosidade para controlar o campo de batalha.",
        "hit_die": "1d8",
        "chakra_die": "1d8",
        "primary_ability": "intelligence",
        "proficiencies": {
            "armor": ["Leve"],
            "weapons": ["Armas Simples"],
            "skills": ["História", "Investigação", "Percepção", "Persuasão"],
            "saving_throws": ["intelligence", "wisdom"]
        },
        "starting_equipment": [
            "Colete de Couro Batido",
            "Kunai (3x)",
            "Kit de Armadilhas",
            "Mapa Estratégico"
        ],
        "starting_wealth": "3d4 x 100 Ryo",
        "special_features": ["Planejamento Tático", "Armadilhas Avançadas"]
    },
    {
        "id": "medical_ninja",
        "name": "Ninja Médico",
        "description": "Praticante avançado de medicina que luta para proteger e manter aliados vivos.",
        "hit_die": "1d8",
        "chakra_die": "1d10",
        "primary_ability": "wisdom",
        "proficiencies": {
            "armor": ["Leve"],
            "weapons": ["Armas Simples", "Kunai"],
            "skills": ["Medicina", "Natureza", "Intuição"],
            "saving_throws": ["wisdom", "constitution"]
        },
        "starting_equipment": [
            "Colete de Couro",
            "Kunai (2x)",
            "Kit Médico Avançado",
            "Pergaminhos de Cura"
        ],
        "starting_wealth": "4d4 x 100 Ryo",
        "special_features": ["Cura com Chakra", "Diagnóstico Médico"]
    },
    {
        "id": "ninjutsu_specialist",
        "name": "Especialista em Ninjutsu",
        "description": "Mestre em técnicas de liberação de natureza, capaz de moldar chakra em ataques devastadores.",
        "hit_die": "1d6",
        "chakra_die": "1d12",
        "primary_ability": "intelligence",
        "proficiencies": {
            "armor": ["Leve"],
            "weapons": ["Armas Simples"],
            "skills": ["Ninjutsu", "Ofícios", "Natureza"],
            "saving_throws": ["intelligence", "constitution"]
        },
        "starting_equipment": [
            "Colete de Couro",
            "Kunai (3x)",
            "Pergaminhos de Jutsu",
            "Kit de Reagentes"
        ],
        "starting_wealth": "3d4 x 100 Ryo",
        "special_features": ["Afinidade Elemental", "Moldar Chakra"]
    },
    {
        "id": "scout_ninja",
        "name": "Ninja Explorador",
        "description": "Versátil, capaz de completar a maioria das tarefas e preencher funções em uma equipe.",
        "hit_die": "1d10",
        "chakra_die": "1d8",
        "primary_ability": "dexterity",
        "proficiencies": {
            "armor": ["Leve", "Média"],
            "weapons": ["Armas Simples", "Armas Marciais"],
            "skills": ["Atletismo", "Sobrevivência", "Percepção", "Furtividade"],
            "saving_throws": ["strength", "dexterity"]
        },
        "starting_equipment": [
            "Colete de Combate",
            "Arco e Flechas (20x)",
            "Kunai (5x)",
            "Kit de Rastreamento"
        ],
        "starting_wealth": "5d4 x 100 Ryo",
        "special_features": ["Versatilidade", "Sentidos Aguçados"]
    },
    {
        "id": "taijutsu_specialist",
        "name": "Especialista em Taijutsu",
        "description": "Mestre do combate corpo a corpo, utilizando combos e técnicas físicas devastadoras.",
        "hit_die": "1d10",
        "chakra_die": "1d8",
        "primary_ability": "strength",
        "proficiencies": {
            "armor": ["Leve", "Média"],
            "weapons": ["Armas Simples", "Armas Marciais", "Combate Desarmado"],
            "skills": ["Taijutsu", "Atletismo", "Acrobacia"],
            "saving_throws": ["strength", "constitution"]
        },
        "starting_equipment": [
            "Colete de Couro Batido",
            "Bandagens de Combate",
            "Pesos de Treinamento"
        ],
        "starting_wealth": "3d4 x 100 Ryo",
        "special_features": ["Ataque Desarmado Aprimorado", "Combo de Golpes"]
    },
    {
        "id": "weapon_specialist",
        "name": "Especialista em Armas",
        "description": "Mestre do combate marcial que utiliza uma ampla variedade de armas e armaduras.",
        "hit_die": "1d10",
        "chakra_die": "1d6",
        "primary_ability": "strength",
        "proficiencies": {
            "armor": ["Leve", "Média", "Pesada"],
            "weapons": ["Armas Simples", "Armas Marciais", "Armas Exóticas"],
            "skills": ["Bukijutsu", "Atletismo", "Intimidação"],
            "saving_throws": ["strength", "constitution"]
        },
        "starting_equipment": [
            "Colete de Chunin",
            "Katana ou Espada Longa",
            "Kunai (5x)",
            "Shuriken (10x)",
            "Kit de Manutenção de Armas"
        ],
        "starting_wealth": "5d4 x 100 Ryo",
        "special_features": ["Maestria em Armas", "Estilo de Combate"]
    }
]
