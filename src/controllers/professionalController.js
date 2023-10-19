const { Professional, Language, Nationality, Itskills } = require('../DB_connection');


const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.findAll(    
      attributes: ['id', 'id_nationality', 'data', 'experience', 'education', 'development_skills', 'extra_information', 'portfolio', 'cci']
    });
  
    if (professionals.length === 0) {
          return res.status(200).json({ message: 'No hay profesionistas en la lista, lista vacia.' });
        }
    const languages = await Language.findAll({ attributes: ['id', 'language'] });
    const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });
    const itskills = await Itskills.findAll({ attributes: ['id', 'it_skill'] });

    const languagesMap = new Map(languages.map((lang) => [lang.id, lang.language]));
    const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));
    const itskillsMap = new Map(itskills.map((it) => [it.id, it.it_skill]));
    console.log(nationalityMap);

    const professionalsWithMappedData = professionals.map((professio) => ({
      id: professio.id,
      nationality: nationalityMap.get(professio.id_nationality),
      data: professio.data,
      experience: professio.experience,
      education: professio.education,
      extra_information: professio.extra_information,
      portfolio: professio.portfolio,
      cci: professio.cci,
    }));

    res.status(200).json(professionalsWithMappedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findByPk(id);

    if (professional) {

      const languages = await Language.findAll({ attributes: ['id', 'language'] });
      const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });
      const itskills = await Itskills.findAll({ attributes: ['id', 'it_skill'] });

      const languagesMap = new Map(languages.map((lang) => [lang.id, lang.language]));
      const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));
      const itskillsMap = new Map(itskills.map((it) => [it.id, it.it_skill]));
      console.log(nationalityMap);

      const professionalsWithMappedData = {
        id: professional.id,
        nationality: nationalityMap.get(professional.id_nationality),
        data: professional.data,
        experience: professional.experience,
        education: professional.education,
        extra_information: professional.extra_information,
        portfolio: professional.portfolio,
        cci: professional.cci,
      };

      res.json(professionalsWithMappedData);
    } else {
      res.status(404).json({ error: 'No se encontro al profesionista.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProfessional = async (req, res) => {
  try {
    const professional = await Professional.create(req.body);
    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Professional.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedProfessional = await Professional.findByPk(id);
      res.json(updatedProfessional);
    } else {
      res.status(404).json({ error: 'No se encontro al Profesionista' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findByPk(id);
    if (professional) {
      professional.state = false;
      await professional.save();
      res.status(200).json({ message: "Profesionista borrado" });
    } else {
      res.status(404).json({ error: 'Profesionista no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessional,
  deleteProfessional
};