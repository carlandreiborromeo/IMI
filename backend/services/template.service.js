import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store templates directory
const TEMPLATES_DIR = path.join(__dirname, '../data/templates');

// Ensure templates directory exists
const ensureTemplatesDirectory = async () => {
  try {
    await fs.access(TEMPLATES_DIR);
  } catch {
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  }
};

// Convert equipment name to filename
const getTemplateFilename = (equipmentName) => {
  // Convert to lowercase, replace spaces and special chars with hyphens
  const sanitized = equipmentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  return `${sanitized}.json`;
};

// Get file path for a template
const getTemplateFilePath = (equipmentName) => {
  return path.join(TEMPLATES_DIR, getTemplateFilename(equipmentName));
};

// Read a single template from file
const readTemplate = async (equipmentName) => {
  try {
    const filePath = getTemplateFilePath(equipmentName);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

// Write a template to file
const writeTemplate = async (template) => {
  await ensureTemplatesDirectory();
  const filePath = getTemplateFilePath(template.equipmentName);
  await fs.writeFile(filePath, JSON.stringify(template, null, 2), 'utf-8');
};

// Delete a template file
const deleteTemplateFile = async (equipmentName) => {
  const filePath = getTemplateFilePath(equipmentName);
  await fs.unlink(filePath);
};

// Get all template files
const getAllTemplateFiles = async () => {
  try {
    await ensureTemplatesDirectory();
    const files = await fs.readdir(TEMPLATES_DIR);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    return [];
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create a new template
export const createTemplate = async (templateData) => {
  // Check if template with same equipment name already exists
  const existing = await readTemplate(templateData.equipmentName);
  
  if (existing) {
    throw new Error('Template with this equipment name already exists');
  }

  const newTemplate = {
    _id: generateId(),
    equipmentName: templateData.equipmentName,
    sections: templateData.sections.map(section => ({
      sectionName: section.sectionName,
      dataColumns: section.dataColumns,
      rows: section.rows || []
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await writeTemplate(newTemplate);
  return newTemplate;
};

// Get all templates
export const getAllTemplates = async () => {
  const files = await getAllTemplateFiles();
  const templates = [];

  for (const file of files) {
    try {
      const filePath = path.join(TEMPLATES_DIR, file);
      const data = await fs.readFile(filePath, 'utf-8');
      const template = JSON.parse(data);
      
      // Return templates with summary info
      templates.push({
        _id: template._id,
        equipmentName: template.equipmentName,
        sectionsCount: template.sections.length,
        totalTestPoints: template.sections.reduce((total, section) => 
          total + (section.rows?.length || 0), 0
        ),
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        sections: template.sections.map(section => ({
          sectionName: section.sectionName,
          dataColumns: section.dataColumns,
          testPointsCount: section.rows?.length || 0
        }))
      });
    } catch (error) {
      console.error(`Error reading template file ${file}:`, error);
    }
  }

  return templates;
};

// Get template by ID
export const getTemplateById = async (id) => {
  const files = await getAllTemplateFiles();

  for (const file of files) {
    try {
      const filePath = path.join(TEMPLATES_DIR, file);
      const data = await fs.readFile(filePath, 'utf-8');
      const template = JSON.parse(data);
      
      if (template._id === id) {
        return template;
      }
    } catch (error) {
      console.error(`Error reading template file ${file}:`, error);
    }
  }

  throw new Error('Template not found');
};

// Update template
export const updateTemplate = async (id, updateData) => {
  // First, find the template by ID
  const files = await getAllTemplateFiles();
  let currentTemplate = null;
  let oldEquipmentName = null;

  for (const file of files) {
    try {
      const filePath = path.join(TEMPLATES_DIR, file);
      const data = await fs.readFile(filePath, 'utf-8');
      const template = JSON.parse(data);
      
      if (template._id === id) {
        currentTemplate = template;
        oldEquipmentName = template.equipmentName;
        break;
      }
    } catch (error) {
      console.error(`Error reading template file ${file}:`, error);
    }
  }

  if (!currentTemplate) {
    throw new Error('Template not found');
  }

  // Check if updating equipment name to one that already exists
  if (updateData.equipmentName && 
      updateData.equipmentName.toLowerCase() !== oldEquipmentName.toLowerCase()) {
    const exists = await readTemplate(updateData.equipmentName);
    
    if (exists) {
      throw new Error('Template with this equipment name already exists');
    }
  }

  const updatedTemplate = {
    ...currentTemplate,
    equipmentName: updateData.equipmentName || currentTemplate.equipmentName,
    sections: updateData.sections || currentTemplate.sections,
    updatedAt: new Date().toISOString()
  };

  // If equipment name changed, delete old file
  if (updateData.equipmentName && 
      updateData.equipmentName.toLowerCase() !== oldEquipmentName.toLowerCase()) {
    await deleteTemplateFile(oldEquipmentName);
  }

  await writeTemplate(updatedTemplate);
  return updatedTemplate;
};

// Delete template
export const deleteTemplate = async (id) => {
  // Find the template by ID to get its equipment name
  const files = await getAllTemplateFiles();

  for (const file of files) {
    try {
      const filePath = path.join(TEMPLATES_DIR, file);
      const data = await fs.readFile(filePath, 'utf-8');
      const template = JSON.parse(data);
      
      if (template._id === id) {
        await deleteTemplateFile(template.equipmentName);
        return true;
      }
    } catch (error) {
      console.error(`Error reading template file ${file}:`, error);
    }
  }

  throw new Error('Template not found');
};