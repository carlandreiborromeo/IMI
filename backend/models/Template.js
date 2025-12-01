import mongoose from 'mongoose';

const RowSchema = new mongoose.Schema({
  appliedValue: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  },
  dataValues: [{
    type: String,
    default: ''
  }],
  uncertainty: {
    type: String,
    default: ''
  },
  marginOfError: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  }
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    trim: true
  },
  dataColumns: {
    type: Number,
    required: true,
    min: 1,
    default: 5
  },
  rows: [RowSchema]
}, { _id: false });

const TemplateSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  sections: [SectionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

TemplateSchema.index({ equipmentName: 1, createdAt: -1 });

TemplateSchema.virtual('totalTestPoints').get(function() {
  return this.sections.reduce((total, section) => total + section.rows.length, 0);
});

TemplateSchema.methods.validateRowStructure = function() {
  for (let section of this.sections) {
    if (section.dataColumns < 1) {
      return {
        valid: false,
        message: `Section "${section.sectionName}" must have at least 1 data column`
      };
    }

    for (let row of section.rows) {
      if (row.dataValues.length !== section.dataColumns) {
        return {
          valid: false,
          message: `Row data count doesn't match section data columns in "${section.sectionName}"`
        };
      }
    }
  }
  
  return { valid: true };
};

const Template = mongoose.model('Template', TemplateSchema);

export default Template;
