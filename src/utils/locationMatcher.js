const { Nation, Province, City } = require('../DB_connection');

async function match(string) {
    const parts = string.split(',');
    console.log(parts);

    const [nationData] = await Nation.findOrCreate({
        where: { nation: parts[2] },
        defaults: { /* Valores por defecto, si es necesario */ }
    });

    const nation = nationData.dataValues.id

    const [provinceData] = await Province.findOrCreate({
        where: {
            id_nation: nation,
            province: parts[1]
        },
        defaults: { /* Valores por defecto, si es necesario */ }
    });

    const province = provinceData.dataValues.id

    const [cityData] = await City.findOrCreate({
        where: {
            id_province: province,
            city: parts[0]
        },
        defaults: { /* Valores por defecto, si es necesario */ }
    });

    const city = cityData.dataValues.id

    console.log(nation, province, city);
    return { nation, province, city };
}

module.exports = { match };
