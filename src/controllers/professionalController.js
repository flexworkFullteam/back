const { Professional, Language, Nationality, Itskills, Project } = require('../DB_connection');


const getProfessionals = async (req, res) => {
  try {
    const professionals = await Professional.findAll(
      {
        where: {
          state: true
        },
        attributes: ['id', 'id_nationality', 'data', 'experience', 'education', 'extra_information', 'portfolio', 'cci'],
      }
    );

    if (professionals.length === 0) {
      return res.status(200).json({ message: 'No hay profesionistas en la lista, lista vacía.' });
    }

    const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });

    const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));

    const professionalsWithMappedData = professionals.map(async (professio) => {
      const skills = await professio.getItskills({ attributes: ['it_skill'], through: { attributes: [] } });
      const languages = await professio.getLanguages({ attributes: ['language'], through: { attributes: [] } });

      return {
        id: professio.id,
        nationality: nationalityMap.get(professio.id_nationality),
        data: professio.data,
        experience: professio.experience,
        education: professio.education,
        extra_information: professio.extra_information,
        portfolio: professio.portfolio,
        cci: professio.cci,
        image: professio.image,
        itskills: skills.map((skill) => skill.it_skill),
        Languages: languages.map((language) => language.language),
      };
    });

    const professionalsData = await Promise.all(professionalsWithMappedData);

    res.status(200).json(professionalsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessional = async (req, res) => {
  const { id } = req.params;
  try {
    const professional = await Professional.findByPk(id, {
      where: {
        state: true
      },
    });

    if (professional) {

      const languages = await Language.findAll({ attributes: ['id', 'language'] });
      const nationality = await Nationality.findAll({ attributes: ['id', 'nationality'] });
      const itskills = await Itskills.findAll({ attributes: ['id', 'it_skill'] });

      const languagesMap = new Map(languages.map((lang) => [lang.id, lang.language]));
      const nationalityMap = new Map(nationality.map((national) => [national.id, national.nationality]));
      const itskillsMap = new Map(itskills.map((it) => [it.id, it.it_skill]));

      // Obten las habilidades del profesional a través de la tabla intermedia
      const professionalItskills = await professional.getItskills();
      // Obten los idiomas del profesional a través de la tabla intermedia
      const professionalLanguages = await professional.getLanguages();

      const professionalSkills = professionalItskills.map((skill) => itskillsMap.get(skill.id));
      const professionalLang = professionalLanguages.map((language) => languagesMap.get(language.id));

      const professionalsWithMappedData = {
        id: professional.id,
        nationality: nationalityMap.get(professional.id_nationality),
        data: professional.data,
        experience: professional.experience,
        education: professional.education,
        extra_information: professional.extra_information,
        portfolio: professional.portfolio,
        cci: professional.cci,
        image: professional.image,
        itskills: professionalSkills,
        languages: professionalLang,
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
    const {
      user, // UUID
      nationality, // UUID
      data, // Obj
      experience, // Obj
      education, // [Obj]
      extra_information, // string
      portfolio, // string
      cci, // int
      itskill, // relacion [UUID]
      languages, // relacion [UUID]
      image // string

    } = req.body

    const fieldRegex = /^[^\n\r\t\v\f\p{P}]{5,}$/u; //   Esto asegurará que la cadena cumpla con la longitud mínima de 5 caracteres y no contenga signos de puntuación.
    const positiveNumberRegex = /^[1-9]\d*$/;
    const arrayUUID = /^\[\s*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}(?:,\s*)?)+\s*\]$/;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const linkRegex = /^https?:\/\/(?:www\.)?[\w\.-]+\.\w{2,}(?:\/\S*)?$/;

    if (!typeof data === "object" || data === null || !typeof experience === "object" || experience === null ||
      !typeof education === "object" || education === null || !fieldRegex.test(extra_information)
      || !linkRegex.test(portfolio) || !positiveNumberRegex.test(cci) || !linkRegex.test(image))
      return res.status(400).send("Error en la validacion de datos, revisa los campos y vuelve a intentarlo")

    const siklls = Array.isArray(itskill) ? itskill : [itskill];
    const lang = Array.isArray(languages) ? languages : [languages];

    const itskillPromises = siklls.map(async (sikllId) => {
      const sikll = await Itskills.findByPk(sikllId);
      if (sikll) {
        return sikll;
      } else {
        return null;
      }
    });
    const langPromises = lang.map(async (languageId) => {
      const language = await Language.findByPk(languageId);
      if (language) {
        return language;
      } else {
        return null;
      }
    });

    const resolvedSiklls = await Promise.all(itskillPromises);
    const resolvedLanguages = await Promise.all(langPromises);

    const validSiklls = resolvedSiklls.filter((sikll) => sikll !== null);
    const validLanguages = resolvedLanguages.filter((language) => language !== null);

    const professional = await Professional.create({
      userId: user,
      id_nationality: nationality,
      data: data,
      experience: experience,
      education: education,
      extra_information: extra_information,
      portfolio: portfolio,
      cci: cci,
      image: image
    });

    await professional.setItskills(validSiklls);
    await professional.setLanguages(validLanguages);

    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user,
      nationality,
      data,
      experience,
      education,
      extra_information,
      portfolio,
      cci,
      itskill,
      languages
    } = req.body;

    const fieldRegex = /^[^\n\r\t\v\f\p{P}]{5,}$/u; //   Esto asegurará que la cadena cumpla con la longitud mínima de 5 caracteres y no contenga signos de puntuación.
    const positiveNumberRegex = /^[1-9]\d*$/;
    const arrayUUID = /^\[\s*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}(?:,\s*)?)+\s*\]$/;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    const linkRegex = /^https?:\/\/(?:www\.)?[\w\.-]+\.\w{2,}(?:\/\S*)?$/;

    if (!typeof data === "object" || data === null || !typeof experience === "object" || experience === null ||
      !typeof education === "object" || education === null || !fieldRegex.test(extra_information)
      || !linkRegex.test(portfolio) || !positiveNumberRegex.test(cci) || !linkRegex.test(image))
      return res.status(400).send("Error en la validacion de datos, revisa los campos y vuelve a intentarlo");

    const skills = Array.isArray(itskill) ? itskill : [itskill];
    const languageIds = Array.isArray(languages) ? languages : [languages];

    const skillsPromises = skills.map(async (skillId) => {
      const skill = await Itskills.findByPk(skillId);
      return skill;
    });

    const languagePromises = languageIds.map(async (languageId) => {
      const language = await Language.findByPk(languageId);
      return language;
    });

    const resolvedSkills = await Promise.all(skillsPromises);
    const resolvedLanguages = await Promise.all(languagePromises);

    const validSkills = resolvedSkills.filter((skill) => skill !== null);
    const validLanguages = resolvedLanguages.filter((language) => language !== null);

    const professional = await Professional.findByPk(id);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado.' });
    }

    professional.userId = user;
    professional.id_nationality = nationality;
    professional.data = data;
    professional.experience = experience;
    professional.education = education;
    professional.extra_information = extra_information;
    professional.portfolio = portfolio;
    professional.cci = cci;

    await professional.setItskills(validSkills);
    await professional.setLanguages(validLanguages);

    await professional.save();

    res.status(200).json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSkillOrLanguageToProfessional = async (req, res) => {
  try {
    const { id, type, itemId } = req.params

    // Busca el profesional por su ID
    const professional = await Professional.findByPk(id);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado.' });
    }

    if (type === 'sikll') {
      // Consulta la habilidad que deseas agregar
      const skill = await Itskills.findByPk(itemId);

      if (!skill) {
        return res.status(404).json({ message: 'Habilidad no encontrada.' });
      }

      // Agrega la habilidad al profesional
      await professional.addItskill(skill);

      res.status(200).json({ message: 'Habilidad agregada con éxito al profesional.' });
    } else if (type === 'language') {
      // Consulta el idioma que deseas agregar
      const language = await Language.findByPk(itemId);

      if (!language) {
        return res.status(404).json({ message: 'Idioma no encontrado.' });
      }

      // Agrega el idioma al profesional
      await professional.addLanguage(language);

      res.status(200).json({ message: 'Idioma agregado con éxito al profesional.' });
    } else {
      return res.status(400).json({ message: 'Tipo no válido. Debe ser "sikll" o "language".' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeSkillOrLanguageFromProfessional = async (req, res) => {
  try {
    const { id, type, itemId } = req.params; // ID del profesional, tipo (sikll o language), e ID de la habilidad o idioma

    // Busca el profesional por su ID
    const professional = await Professional.findByPk(id);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado.' });
    }

    if (type === 'sikll') {
      // Consulta la habilidad que deseas eliminar
      const skill = await Itskills.findByPk(itemId);

      if (!skill) {
        return res.status(404).json({ message: 'Habilidad no encontrada.' });
      }

      // Elimina la habilidad del profesional
      await professional.removeItskill(skill);

      res.status(200).json({ message: 'Habilidad eliminada con éxito del profesional.' });
    } else if (type === 'language') {
      // Consulta el idioma que deseas eliminar
      const language = await Language.findByPk(itemId);

      if (!language) {
        return res.status(404).json({ message: 'Idioma no encontrado.' });
      }

      // Elimina el idioma del profesional
      await professional.removeLanguage(language);

      res.status(200).json({ message: 'Idioma eliminado con éxito del profesional.' });
    } else {
      return res.status(400).json({ message: 'Tipo no válido. Debe ser "sikll" o "language".' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProyectProfessional = async (req, res) => {
  try {
    const { projectId, professionalId } = req.params

    // Busca el profesional por su ID
    const professional = await Professional.findByPk(professionalId);

    if (!professional) {
      return res.status(404).json({ message: 'Profesional no encontrado.' });
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado.' });
    }

    // Agrega el idioma al profesional
    await professional.addPostulatedProjects(project);

    res.status(200).json({ message: 'Postulacion exitosa.' });

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
  deleteProfessional,
  addSkillOrLanguageToProfessional,
  removeSkillOrLanguageFromProfessional,
  addProyectProfessional
};