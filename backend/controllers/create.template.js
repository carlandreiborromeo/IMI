import Template from '../models/Template.js';

export const CreateTemplate = async (req, res) => {
  try {
    const { equipmentName, sections } = req.body;

    if (!equipmentName || !equipmentName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Equipment name is required'
      });
    }

    if (!sections || sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one section is required'
      });
    }

    for (let section of sections) {
      if (!section.sectionName || !section.sectionName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'All sections must have a name'
        });
      }

      if (!section.dataColumns || section.dataColumns < 1) {
        return res.status(400).json({
          success: false,
          message: `Section "${section.sectionName}" must have at least 1 data column`
        });
      }

      if (section.rows && section.rows.length > 0) {
        for (let row of section.rows) {
          if (!row.dataValues || row.dataValues.length !== section.dataColumns) {
            return res.status(400).json({
              success: false,
              message: `Row data count doesn't match section data columns in "${section.sectionName}"`
            });
          }
        }
      }
    }

    const template = new Template({
      equipmentName: equipmentName.trim(),
      sections: sections.map(section => ({
        sectionName: section.sectionName.trim(),
        dataColumns: section.dataColumns,
        rows: section.rows || []
      })),
      createdBy: req.user?._id
    });

    const validation = template.validateRowStructure();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: {
        templateId: template._id,
        equipmentName: template.equipmentName,
        sectionsCount: template.sections.length,
        totalTestPoints: template.totalTestPoints,
        createdAt: template.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating template:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A template with this equipment name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
};

export const GetAllTemplates = async (req, res) => {
  try {
    const { equipmentName, isActive = true } = req.query;
    
    const filter = { isActive };
    if (equipmentName) {
      filter.equipmentName = { $regex: equipmentName, $options: 'i' };
    }

    const templates = await Template.find(filter)
      .select('equipmentName sections createdAt updatedAt')
      .sort({ createdAt: -1 });

    const templatesWithSummary = templates.map(template => ({
      _id: template._id,
      equipmentName: template.equipmentName,
      sectionsCount: template.sections.length,
      totalTestPoints: template.sections.reduce((total, section) => total + section.rows.length, 0),
      sections: template.sections.map(section => ({
        sectionName: section.sectionName,
        dataColumns: section.dataColumns,
        testPointsCount: section.rows.length
      })),
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    }));

    res.status(200).json({
      success: true,
      count: templatesWithSummary.length,
      data: templatesWithSummary
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

export const GetTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
};

export const UpdateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentName, sections } = req.body;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    if (equipmentName) template.equipmentName = equipmentName.trim();
    if (sections) template.sections = sections;

    const validation = template.validateRowStructure();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    await template.save();

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template',
      error: error.message
    });
  }
};

export const DeleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    template.isActive = false;
    await template.save();

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template',
      error: error.message
    });
  }
};
