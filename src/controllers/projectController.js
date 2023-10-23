const {
  Project,
  Company,
  ProjectType,
  ProjectFields,
  ExperienceLevel,
  Language,
  Itskills,
  Professional,
} = require("../DB_connection");

// Crear un proyecto
const createProject = async (req, res) => {
  try {
    const {
      title,
      companyId,
      description,
      field,
      type,
      location,
      salary,
      exp_req,
      lapse,
      itskill,
      languages,
    } = req.body;
    //console.log(companyId);
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
    const validLanguages = resolvedLanguages.filter(
      (language) => language !== null
    );

    const project = await Project.create({
      title: title,
      id_company: companyId,
      description: description,
      field: field,
      type: type,
      location: location,
      salary: salary,
      exp_req: exp_req,
      lapse: lapse,
    });
    console.log(project.id_company);
    await project.setItskills(validSiklls);
    await project.setLanguages(validLanguages);

    res.status(201).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el proyecto", error: error.message });
  }
};

// Obtener todos los proyectos
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        state: true
      },
      attributes: [
        "id",
        "title",
        "id_company",
        "description",
        "field",
        "type",
        "salary",
        "exp_req",
        "lapse",
        "state",
      ],
    });

    if (projects.length === 0) {
      return res
        .status(500)
        .json({ message: "Error al obtener los proyectos" });
    }

    // Obtén la información adicional de las tablas relacionadas
    const companys = await Company.findAll({
      attributes: ["id", "business_name"],
    });
    const projectType = await ProjectType.findAll({
      attributes: ["id", "project_type"],
    });
    const projectFields = await ProjectFields.findAll({
      attributes: ["id", "project_fields"],
    });
    const experienceLevel = await ExperienceLevel.findAll({
      attributes: ["id", "experienceLevel"],
    });

    // Crea mapas para mapear IDs a strings correspondientes
    const companysMap = new Map(
      companys.map((company) => [company.id, company.business_name])
    );
    const projectTypeMap = new Map(
      projectType.map((type) => [type.id, type.project_type])
    );
    const projectFieldsMap = new Map(
      projectFields.map((field) => [field.id, field.project_fields])
    );
    const experienceLevelMap = new Map(
      experienceLevel.map((level) => [level.id, level.experienceLevel])
    );

    // Mapea los IDs de proyectos a sus correspondientes strings
    const projectsWithMappedData = projects.map((project) => ({
      id: project.id,
      title: project.title,
      id_company: companysMap.get(project.id_company),
      description: project.description,
      field: projectFieldsMap.get(project.field),
      type: projectTypeMap.get(project.type),
      salary: project.salary,
      exp_req: experienceLevelMap.get(project.exp_req),
      lapse: project.lapse,
      state: project.state,
    }));
    console.log(projectsWithMappedData);
    res.status(200).json(projectsWithMappedData);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los proyectos",
      error: error.message,
    });
  }
};

const getAllCompanyProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        id_company: req.params.id_company,
        state: true,
      },
      attributes: [
        "id",
        "title",
        "id_company",
        "description",
        "field",
        "type",
        "salary",
        "exp_req",
        "lapse",
      ],
    });

    if (projects.length === 0) {
      return res
        .status(500)
        .json({ message: "Error al obtener los proyectos" });
    }

    // Obtén la información adicional de las tablas relacionadas
    const companys = await Company.findAll({
      attributes: ["id", "business_name"],
    });
    const projectType = await ProjectType.findAll({
      attributes: ["id", "project_type"],
    });
    const projectFields = await ProjectFields.findAll({
      attributes: ["id", "project_fields"],
    });
    const experienceLevel = await ExperienceLevel.findAll({
      attributes: ["id", "experienceLevel"],
    });

    // Crea mapas para mapear IDs a strings correspondientes
    const companysMap = new Map(
      companys.map((company) => [company.id, company.business_name])
    );
    const projectTypeMap = new Map(
      projectType.map((type) => [type.id, type.project_type])
    );
    const projectFieldsMap = new Map(
      projectFields.map((field) => [field.id, field.project_fields])
    );
    const experienceLevelMap = new Map(
      experienceLevel.map((level) => [level.id, level.experienceLevel])
    );

    // Mapea los IDs de proyectos a sus correspondientes strings
    const projectsWithMappedData = projects.map((project) => ({
      id: project.id,
      title: project.title,
      id_company: companysMap.get(project.id_company),
      description: project.description,
      field: projectFieldsMap.get(project.field),
      type: projectTypeMap.get(project.type),
      salary: project.salary,
      exp_req: experienceLevelMap.get(project.exp_req),
      lapse: project.lapse,
    }));
    console.log(projectsWithMappedData);
    res.status(200).json(projectsWithMappedData);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los proyectos",
      error: error.message,
    });
  }
};

// Obtener un proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id,
      {
        where: {
          state: true
        },
      }
    );

    if (project) {
      // Obtén información adicional de las tablas relacionadas
      const companys = await Company.findAll({
        attributes: ["id", "business_name"],
      });
      const projectType = await ProjectType.findAll({
        attributes: ["id", "project_type"],
      });
      const projectFields = await ProjectFields.findAll({
        attributes: ["id", "project_fields"],
      });
      const experienceLevel = await ExperienceLevel.findAll({
        attributes: ["id", "experienceLevel"],
      });

      // Crea mapas para mapear IDs a strings correspondientes
      const companysMap = new Map(
        companys.map((company) => [company.id, company.business_name])
      );
      const projectTypeMap = new Map(
        projectType.map((type) => [type.id, type.project_type])
      );
      const projectFieldsMap = new Map(
        projectFields.map((field) => [field.id, field.project_fields])
      );
      const experienceLevelMap = new Map(
        experienceLevel.map((level) => [level.id, level.experienceLevel])
      );

      // Mapea los IDs del proyecto a sus correspondientes strings
      const projectWithMappedData = {
        id: project.id,
        title: project.title,
        id_company: companysMap.get(project.id_company),
        description: project.description,
        field: projectFieldsMap.get(project.field),
        type: projectTypeMap.get(project.type),
        salary: project.salary,
        exp_req: experienceLevelMap.get(project.exp_req),
        lapse: project.lapse,
      };

      res.status(200).json(projectWithMappedData);
    } else {
      res.status(404).json({ message: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el proyecto", error });
  }
};

// Actualizar un proyecto
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      await project.update(req.body);
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el proyecto", error });
  }
};

// Borrado lógico de un proyecto
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      project.state = false;
      await project.save();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Proyecto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al borrar el proyecto", error });
  }
};

const acceptedProyectProfessional = async (req, res) => {
  try {
    const { projectId, professionalId } = req.params;

    // Busca el profesional por su ID
    const professional = await Professional.findByPk(professionalId);

    if (!professional) {
      return res.status(404).json({ message: "Profesional no encontrado." });
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    // Agrega al profesional
    await professional.removePostulatedProjects(project);
    // Agrega al profesional a "Acepted_Professionals"
    await professional.addAcceptedProjects(project);

    res.status(200).json({ message: "Aceptacion exitosa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refuceProyectProfessional = async (req, res) => {
  try {
    const { projectId, professionalId } = req.params;

    // Busca el profesional por su ID
    const professional = await Professional.findByPk(professionalId);

    if (!professional) {
      return res.status(404).json({ message: "Profesional no encontrado." });
    }

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    // Agrega al profesional
    await professional.removePostulatedProjects(project);
    // Agrega al profesional a "Refused_Professionals"
    await professional.addRefusedProjects(project);

    res.status(200).json({ message: "Rechazo exitoso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessionalPostulant = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    console.log(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    const postulados = await project.getPostulatingProfessionals();

    res.status(200).json(postulados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessionalAccepted = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    const aceptados = await project.getAcceptedProfessionals();

    res.status(200).json(aceptados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfessionalRefused = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    const rechazados = await project.getRefusedProfessionals();

    res.status(200).json(rechazados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  acceptedProyectProfessional,
  refuceProyectProfessional,
  getProfessionalPostulant,
  getProfessionalAccepted,
  getProfessionalRefused,
  getAllCompanyProjects,
};
