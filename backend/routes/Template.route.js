import express from 'express';
import {
  CreateTemplate,
  GetAllTemplates,
  GetTemplateById,
  UpdateTemplate,
  DeleteTemplate
} from '../controllers/create.template.js';

const router = express.Router();

router.post('/createTemplate', CreateTemplate);
router.get('/getAllTemplates', GetAllTemplates);
router.get('/getTemplate/:id', GetTemplateById);
router.put('/updateTemplate/:id', UpdateTemplate);
router.delete('/deleteTemplate/:id', DeleteTemplate);

export default router;
