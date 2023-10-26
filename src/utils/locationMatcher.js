const { Nation, Province, City } = require('../DB_connection');

async function match(string) {
    const parts = string.split(',');
    const nation = await Nation.findOrCreate(parts[3],
        {
            where: { nation: parts[3] },
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
    const city = await City.findOrCreate(parts[0],
        {
            where: {
                id_province: province,
                city: parts[0]
            },
            attributes: ['id']
        });
        return {nation,province,city};
}

module.exports = {match};
