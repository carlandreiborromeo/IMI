// 
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from '../services/template.service.js';

export const CreateTemplate = async (req, res) => {
  try {
    const { equipmentName, sections } = req.body;

    if (!equipmentName || !equipmentName.trim()) {
      return res.status(400).json({
        success: false
      });
    }

    if (!sections || sections.length === 0) {
      return res.status(400).json({
        success: false
      });
    }

    for (let section of sections) {
      if (!section.sectionName || !section.sectionName.trim()) {
        return res.status(400).json({
          success: false
        });
      }

      if (!section.dataColumns || section.dataColumns < 1) {
        return res.status(400).json({
          success: false
        });
      }

      if (!section.rows || section.rows.length === 0) {
        return res.status(400).json({
          success: false
        });
      }

      if (section.rows && section.rows.length > 0) {
        for (let row of section.rows) {
          if (!row.appliedValue || !row.appliedValue.trim()) {
            return res.status(400).json({
              success: false
            });
          }

          if (!row.unit || !row.unit.trim()) {
            return res.status(400).json({
              success: false
            });
          }

          if (!row.dataValues || row.dataValues.length !== section.dataColumns) {
            return res.status(400).json({
              success: false
            });
          }
        }
      }
    }

    const template = await createTemplate({
      equipmentName: equipmentName.trim(),
      sections: sections.map(section => ({
        sectionName: section.sectionName.trim(),
        dataColumns: section.dataColumns,
        rows: section.rows || []
      }))
    });

    res.status(201).json({
      success: true,
      data: {
        templateId: template._id,
        equipmentName: template.equipmentName,
        sectionsCount: template.sections.length,
        totalTestPoints: template.sections.reduce((total, section) => total + section.rows.length, 0),
        createdAt: template.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating template:', error);

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const GetAllTemplates = async (req, res) => {
  try {
    const { equipmentName } = req.query;

    let templates = await getAllTemplates();

    if (equipmentName) {
      const searchTerm = equipmentName.toLowerCase();
      templates = templates.filter(t =>
        t.equipmentName.toLowerCase().includes(searchTerm)
      );
    }

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const GetTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await getTemplateById(id);

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);

    if (error.message === 'Template not found') {
      return res.status(404).json({
        success: false
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const UpdateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentName, sections } = req.body;

    if (!equipmentName || !equipmentName.trim()) {
      return res.status(400).json({
        success: false
      });
    }

    if (!sections || sections.length === 0) {
      return res.status(400).json({
        success: false
      });
    }

    for (let section of sections) {
      if (!section.sectionName || !section.sectionName.trim()) {
        return res.status(400).json({
          success: false
        });
      }

      if (!section.dataColumns || section.dataColumns < 1) {
        return res.status(400).json({
          success: false
        });
      }

      if (!section.rows || section.rows.length === 0) {
        return res.status(400).json({
          success: false
        });
      }

      if (section.rows && section.rows.length > 0) {
        for (let row of section.rows) {
          if (!row.appliedValue || !row.appliedValue.trim()) {
            return res.status(400).json({
              success: false
            });
          }

          if (!row.unit || !row.unit.trim()) {
            return res.status(400).json({
              success: false
            });
          }

          if (!row.dataValues || row.dataValues.length !== section.dataColumns) {
            return res.status(400).json({
              success: false
            });
          }
        }
      }
    }

    const template = await updateTemplate(id, {
      equipmentName: equipmentName.trim(),
      sections
    });

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error updating template:', error);

    if (error.message === 'Template not found') {
      return res.status(404).json({
        success: false
      });
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const DeleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTemplate(id);

    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting template:', error);

    if (error.message === 'Template not found') {
      return res.status(404).json({
        success: false
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};