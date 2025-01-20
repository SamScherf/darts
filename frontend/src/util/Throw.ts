export interface Throw {
    value: number;
    hit: number;
    modifier?: Modifier;
    startingScore: number;
}

export enum Modifier {
    double,
    treble,
    inner,
    outer,
    floor,
    wood,
    board,
    wall
}

