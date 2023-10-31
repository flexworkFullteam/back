const { Nation, Province, City } = require('../DB_connection');

async function match(string) {
    let nation, province, city;
    const parts = string.split(',');
    const length = parts.length-1;
    //console.log(parts);

    if ((typeof parts[length] !== 'undefined') ) {
        const [nationData] = await Nation.findOrCreate({
            where: { nation: parts[length] },
            defaults: { /* Valores por defecto, si es necesario */ }
        });
    
        nation = nationData.dataValues.id
            
    }
    if ((typeof parts[length - 1] !== 'undefined') ) {
        const [provinceData] = await Province.findOrCreate({
            where: {
                id_nation: nation,
                province: parts[length-1]
            },
            defaults: { /* Valores por defecto, si es necesario */ }
        });    
        province = provinceData.dataValues.id              
    }

    if ((typeof parts[length - 2] !== 'undefined') ) {
        const [cityData] = await City.findOrCreate({
            where: {
                id_province: province,
                city: parts[length-2]
            },
            defaults: { /* Valores por defecto, si es necesario */ }
        });    
        city = cityData.dataValues.id        
    }

    //console.log(nation, province, city);
    return { nation, province, city };
}

module.exports = { match };
