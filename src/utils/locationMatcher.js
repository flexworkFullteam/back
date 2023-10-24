const { Nation, Province, City } = require('../DB_connection');

const string = "larrea,buenos aires, argentina";

async function match(string) {
    const parts = string.split(',');
    const nation = await Nation.findOrCreate(parts[0],
        {
            where: { nation: parts[0] },
            attributes: ['id']
        });
    const province = await Province.findOrCreate(parts[1],
        {
            where: { 
                id_nation: nation,
                province: parts[1]
            },
            attributes: ['id']
        });
    const city = await City.findOrCreate(parts[2],
        {
            where: { 
                id_province: province,
                city: parts[2]
            },
            attributes: ['id']
        });

    
}

// Llama a la función match
match(string);
