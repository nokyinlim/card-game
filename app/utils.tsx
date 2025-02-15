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

export type DamageValue = {
    damage: number;
    element: string;
    targets: string;
}

export type Castable = {
    name: string;
    lore: string;
    info: string;
    cost: number;
    effect: StatModifier[];
    type: string;
    damage: DamageValue;
    cooldown: number;
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
    character_data: JSON;
    stat_modifiers: StatModifier[];
    active_modifiers: StatModifier[];
    activeEffects: StatModifier[];
    effects: object[];
    abilities: Castable[];
    spells: Castable[];
    passives: string;
    equipment: object[];
    inventory: object[];
    description: string;
}

export function get_turn_color(turns_until: number): string {
    if (turns_until === 0) {
        return "border-lime-400";
    } else if (turns_until === 1) {
        return "border-yellow-400";
    } else if (turns_until === 2) {
        return "border-red-400";
    } else {
        return "";
    }
}

export function get_turn_message(turns_until: number): string {
    if (turns_until === 0) {
        return "Active Player"
    } else if (turns_until === 1) {
        return "Next Player"
    }
    return `Next Turn in ${turns_until} turns`
}

export function get_portrait_src(char_name: string) {


    let portrait_src: string = `/character_portraits/${char_name.replace(" ", "")}.png`;
}