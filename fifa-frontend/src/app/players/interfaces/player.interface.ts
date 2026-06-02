export interface Player {
    id?: number, // 1,

    //personal data
    shortName: string, //"L. Messi",
    longName: string, //"Lionel Andrés Messi Cuccittini",
    birthDate: string //"1987-06-23",
    preferredFoot: string, //"Left",
    playerFaceUrl: string, //"https://cdn.sofifa.net/players/158/023/15_120.png",
    nationalityName: string, //"Argentina",

     //fifa data
    fifaVersion: number, //15,
    playerId: number, //158023,     //0 para nuevos. buscar ultimo id por fifaversion
    clubName: string, //"FC Barcelona",
    playerPositions: string, //"CF",    
    valueEur: number, //100500000,    
        
    //skilss
    overall: number, //93,
    potential: number, //95,
    pace: number, //93,
    shooting: number, //89,
    passing: number, //86,
    dribbling: number, //96,
    defending: number, //27,
    physic: number, //63,     
}