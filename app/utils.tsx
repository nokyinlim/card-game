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