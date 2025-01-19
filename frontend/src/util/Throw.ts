export interface Throw {
    value: number;
    modifier?: Modifier
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

