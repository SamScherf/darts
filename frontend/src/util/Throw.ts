export interface Throw {
    // Value of the throw
    value: number;

    // Username of the thrower
    user: string;
    
    // Which throw of a given turn was it
    throwIndex: number;

    // Which turn was it in the whole game
    turnIndex: number;
   
    // What number was hit
    hit: number;
    
    // Modifier that was hit
    modifier?: Modifier;
    
    // The score before the throw was made
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

