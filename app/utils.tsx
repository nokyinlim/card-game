export type Action = {
    type: string;
    name: string;
    params: string[];
    info?: {
        name: string;
        lore: string;
        info: string;
        mp_cost?: number;
        effects?: any[];
        type?: string;
        damage?: {
            damage: number;
            element: string;
            targets: string;
        };
        cooldown?: number;
    };
};

export type StatModifier = {
    id: string;
    stat: string;
    value: number;
    modifier_type: string;
    duration: number;
    targetsSelf: boolean;
    applyer: any;
    displayName: string;
}

export type Castable = {
    name: string;
    lore: string;
    
}

export type BaseStats = {
    health: number;
    max_health: number;
    mp: number;
    max_mp: number;
    spell_damage: number;
    attack_damage: number;
    critical_chance: number;
    defense: number;
    magic_defense: number;
    accuracy: number;
    agility: number;
    skill_points: number;
    max_skill_points: number;
}

export type Character = {
    name: string;
    character_class: string;
    team: string;
    element: string;
    base_stats: BaseStats;
    character_data: object;

}

export const character_portraits = {
    "Armored Sentinel": require("public/character_portraits/Guardian.png"),
    "Electric-Mage": require("public/character_portraits/Electric-Mage.png"),
    "Sorcerer": require("public/character_portraits/Sorcerer.png"),
}