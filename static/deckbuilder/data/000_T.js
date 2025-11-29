const EXTRA_TERRAINS = {
    "cards": [
        {"name": "Land","frame": "Terrain","types": "Terrain","set": "T","id": "01","deck": "A","duelist": "","attribute": "-","grade": "glyph","gradeval": "-"}
        ,{"name": "Arena","frame": "Terrain","types": "Terrain","set": "T","id": "02","deck": "A","duelist": "","attribute": "light","grade": "glyph","gradeval": "Knighted"}
        ,{"name": "Forest","frame": "Terrain","types": "Terrain","set": "T","id": "03","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Beast - Insect - Plant"}
        ,{"name": "Wasteland","frame": "Terrain","types": "Terrain","set": "T","id": "04","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Dinosaur - Reptilian - EARTH Elemental"}
        ,{"name": "Mountain","frame": "Terrain","types": "Terrain","set": "T","id": "05","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Avian - Dragon - Flying"}
        ,{"name": "Meadow","frame": "Terrain","types": "Terrain","set": "T","id": "06","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Warrior"}
        ,{"name": "Sea","frame": "Terrain","types": "Terrain","set": "T","id": "07","deck": "A","duelist": "","attribute": "water","grade": "glyph","gradeval": "Aquatic - WATER Elemental"}
        ,{"name": "Rugged Coast","frame": "Terrain","types": "Terrain","set": "T","id": "08","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Aquatic - EARTH/WATER Elemental"}
        ,{"name": "Night","frame": "Terrain","types": "Terrain","set": "T","id": "09","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "DARK"}
        ,{"name": "Lake","frame": "Terrain","types": "Terrain","set": "T","id": "10","deck": "A","duelist": "","attribute": "water","grade": "glyph","gradeval": "Reptilian - WATER"}
        ,{"name": "Virtual Simulation Field","frame": "Terrain","types": "Terrain","set": "T","id": "11","deck": "A","duelist": "","attribute": "light","grade": "glyph","gradeval": "Cyberse"}
        ,{"name": "Graveyard","frame": "Terrain","types": "Terrain","set": "T","id": "12","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "Undead - Zombie"}
        ,{"name": "Labyrinth","frame": "Terrain","types": "Terrain","set": "T","id": "13","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Sealed"}
        ,{"name": "Castle Grounds","frame": "Terrain","types": "Terrain","set": "T","id": "14","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Knighted"}
        ,{"name": "Desert","frame": "Terrain","types": "Terrain","set": "T","id": "15","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Burrowing - Illusion"}
        ,{"name": "Cave","frame": "Terrain","types": "Terrain","set": "T","id": "16","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Burrowing - Swarm - EARTH Elemental"}
        ,{"name": "Vortex","frame": "Terrain","types": "Terrain","set": "T","id": "17","deck": "A","duelist": "","attribute": "wind","grade": "glyph","gradeval": "Avian - Flying - WIND "}
        ,{"name": "Volcano","frame": "Terrain","types": "Terrain","set": "T","id": "18","deck": "A","duelist": "","attribute": "fire","grade": "glyph","gradeval": "Fireblast - FIRE"}
        ,{"name": "Ruins","frame": "Terrain","types": "Terrain","set": "T","id": "19","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Esper - Support - EARTH Elemental"}
        ,{"name": "Dragon Valley","frame": "Terrain","types": "Terrain","set": "T","id": "20","deck": "A","duelist": "","attribute": "light","grade": "glyph","gradeval": "Dragon"}
        ,{"name": "Dungeon","frame": "Terrain","types": "Terrain","set": "T","id": "21","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Dragon"}
        ,{"name": "Swamp","frame": "Terrain","types": "Terrain","set": "T","id": "22","deck": "A","duelist": "","attribute": "water","grade": "glyph","gradeval": "Insect - Plant - Reptilian"}
        ,{"name": "Icefield","frame": "Terrain","types": "Terrain","set": "T","id": "23","deck": "A","duelist": "","attribute": "water","grade": "glyph","gradeval": "Frost - WATER Elemental"}
        ,{"name": "Palace","frame": "Terrain","types": "Terrain","set": "T","id": "24","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Support"}
        ,{"name": "Factory","frame": "Terrain","types": "Terrain","set": "T","id": "25","deck": "A","duelist": "","attribute": "fire","grade": "glyph","gradeval": "Machine"}
        ,{"name": "City","frame": "Terrain","types": "Terrain","set": "T","id": "26","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Esper"}
        ,{"name": "Space","frame": "Terrain","types": "Terrain","set": "T","id": "27","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "Cosmic"}
        ,{"name": "Canyon","frame": "Terrain","types": "Terrain","set": "T","id": "28","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "EARTH Elemental"}
        ,{"name": "Fogfield","frame": "Terrain","types": "Terrain","set": "T","id": "29","deck": "A","duelist": "","attribute": "wind","grade": "glyph","gradeval": "Illusion - WIND Elemental"}
        ,{"name": "Jungle","frame": "Terrain","types": "Terrain","set": "T","id": "30","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Dinosaur - Plant - Reptilian"}
        ,{"name": "Different Dimension","frame": "Terrain","types": "Terrain","set": "T","id": "31","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "Eldritch"}
        ,{"name": "Tundra","frame": "Terrain","types": "Terrain","set": "T","id": "32","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Burrowing - Frost"}
        ,{"name": "Temple","frame": "Terrain","types": "Terrain","set": "T","id": "33","deck": "A","duelist": "","attribute": "light","grade": "glyph","gradeval": "Divine - Blessed"}
        ,{"name": "River","frame": "Terrain","types": "Terrain","set": "T","id": "34","deck": "A","duelist": "","attribute": "water","grade": "glyph","gradeval": "WATER"}
        ,{"name": "Sky","frame": "Terrain","types": "Terrain","set": "T","id": "35","deck": "A","duelist": "","attribute": "wind","grade": "glyph","gradeval": "Angel - Avian - Flying"}
        ,{"name": "Underworld","frame": "Terrain","types": "Terrain","set": "T","id": "36","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "Demon - Fallen - DARK Elemental"}
        ,{"name": "Scrapyard","frame": "Terrain","types": "Terrain","set": "T","id": "37","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Union - Metalized"}
        ,{"name": "Colosseum","frame": "Terrain","types": "Terrain","set": "T","id": "38","deck": "A","duelist": "","attribute": "light","grade": "glyph","gradeval": "Knighted - Warrior"}
        ,{"name": "Indoors","frame": "Terrain","types": "Terrain","set": "T","id": "39","deck": "A","duelist": "","attribute": "earth","grade": "glyph","gradeval": "Slumbering"}
        ,{"name": "Darkness","frame": "Terrain","types": "Terrain","set": "T","id": "40","deck": "A","duelist": "","attribute": "dark","grade": "glyph","gradeval": "Eldritch"}
    ]
};
