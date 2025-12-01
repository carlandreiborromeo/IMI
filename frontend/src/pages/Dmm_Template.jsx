import React, { useState } from 'react';
import api from '../utils/api';
const Dmm_Template = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [template, setTemplate] = useState({
    equipmentName: '',
    sections: []
  });

  const addSection = () => {
    setTemplate({
      ...template,
      sections: [
        ...template.sections,
        {
          sectionName: '',
          dataColumns: 5,
          rows: []
        }
      ]
    });
  };

  const updateSectionName = (sectionIdx, value) => {
    const newSections = [...template.sections];
    newSections[sectionIdx].sectionName = value;
    setTemplate({ ...template, sections: newSections });
  };

  const updateDataColumns = (sectionIdx, value) => {
    const newSections = [...template.sections];
    const numColumns = parseInt(value) || 1;
    const oldColumns = newSections[sectionIdx].dataColumns;
    
    newSections[sectionIdx].dataColumns = numColumns;
    
    newSections[sectionIdx].rows.forEach(row => {
      if (numColumns > oldColumns) {
        const diff = numColumns - oldColumns;
        row.dataValues.push(...Array(diff).fill(''));
      } else if (numColumns < oldColumns) {
        row.dataValues = row.dataValues.slice(0, numColumns);
      }
    });
    
    setTemplate({ ...template, sections: newSections });
  };

  const addRow = (sectionIdx) => {
    const newSections = [...template.sections];
    const numDataColumns = newSections[sectionIdx].dataColumns;
    
    const newRow = {
      appliedValue: '',
      unit: '',
      dataValues: Array(numDataColumns).fill(''),
      uncertainty: '',
      marginOfError: '',
      remarks: ''
    };
    
    newSections[sectionIdx].rows.push(newRow);
    setTemplate({ ...template, sections: newSections });
  };

  const updateRowField = (sectionIdx, rowIdx, field, value) => {
    const newSections = [...template.sections];
    newSections[sectionIdx].rows[rowIdx][field] = value;
    setTemplate({ ...template, sections: newSections });
  };

  const updateDataValue = (sectionIdx, rowIdx, dataIdx, value) => {
    const newSections = [...template.sections];
    newSections[sectionIdx].rows[rowIdx].dataValues[dataIdx] = value;
    setTemplate({ ...template, sections: newSections });
  };

  const removeRow = (sectionIdx, rowIdx) => {
    const newSections = [...template.sections];
    newSections[sectionIdx].rows.splice(rowIdx, 1);
    setTemplate({ ...template, sections: newSections });
  };

  const removeSection = (sectionIdx) => {
    const newSections = template.sections.filter((_, idx) => idx !== sectionIdx);
    setTemplate({ ...template, sections: newSections });
  };

  const saveTemplate = async () => {
    if (!template.equipmentName.trim()) {
      setMessage({ type: 'error', text: 'Please enter an equipment name' });
      return;
    }

    if (template.sections.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one section' });
      return;
    }

    for (let section of template.sections) {
      if (!section.sectionName.trim()) {
        setMessage({ type: 'error', text: 'All sections must have a name' });
        return;
      }
      
      if (section.dataColumns < 1) {
        setMessage({ type: 'error', text: 'Each section must have at least 1 data column' });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/Templates/createTemplate', template);
      
      setMessage({ type: 'success', text: 'Template saved successfully!' });
      
      setTimeout(() => {
        setTemplate({ equipmentName: '', sections: [] });
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save template' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-blue-400">DMM Template Creator</h1>
          <p className="text-gray-400 text-sm mt-1">Create calibration templates for equipment</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">Equipment Name</label>
          <input
            type="text"
            value={template.equipmentName}
            onChange={(e) => setTemplate({ ...template, equipmentName: e.target.value })}
            placeholder="e.g., Fluke 8846A"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {template.sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-400">Section {sIdx + 1}</h3>
              <button
                onClick={() => removeSection(sIdx)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">Section Name</label>
              <input
                type="text"
                value={section.sectionName}
                onChange={(e) => updateSectionName(sIdx, e.target.value)}
                placeholder="e.g., DC VOLTS GAIN TEST"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">Number of Data Columns</label>
              <input
                type="number"
                min="1"
                max="20"
                value={section.dataColumns}
                onChange={(e) => updateDataColumns(sIdx, e.target.value)}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="ml-2 text-xs text-gray-500">(DATA 1 to DATA {section.dataColumns})</span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs text-gray-400">Test Points</label>
                <button
                  onClick={() => addRow(sIdx)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                >
                  + Add Row
                </button>
              </div>

              {section.rows.length === 0 ? (
                <div className="text-center py-6 bg-gray-700 rounded border border-gray-600">
                  <p className="text-gray-500 text-sm">No test points</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="border border-gray-600 px-2 py-1">#</th>
                        <th className="border border-gray-600 px-2 py-1">Applied Value</th>
                        <th className="border border-gray-600 px-2 py-1">Unit</th>
                        {Array.from({ length: section.dataColumns }, (_, i) => (
                          <th key={i} className="border border-gray-600 px-2 py-1 bg-blue-900">DATA {i + 1}</th>
                        ))}
                        <th className="border border-gray-600 px-2 py-1 bg-yellow-900">Uncertainty</th>
                        <th className="border border-gray-600 px-2 py-1 bg-orange-900">Margin</th>
                        <th className="border border-gray-600 px-2 py-1 bg-purple-900">Remarks</th>
                        <th className="border border-gray-600 px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td className="border border-gray-600 px-2 py-1 text-center text-gray-400">{rIdx + 1}</td>
                          <td className="border border-gray-600 p-1">
                            <input
                              type="text"
                              value={row.appliedValue}
                              onChange={(e) => updateRowField(sIdx, rIdx, 'appliedValue', e.target.value)}
                              className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                              placeholder="100"
                            />
                          </td>
                          <td className="border border-gray-600 p-1">
                            <input
                              type="text"
                              value={row.unit}
                              onChange={(e) => updateRowField(sIdx, rIdx, 'unit', e.target.value)}
                              className="w-12 px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                              placeholder="mV"
                            />
                          </td>
                          {row.dataValues.map((dataVal, dIdx) => (
                            <td key={dIdx} className="border border-gray-600 p-1 bg-blue-950">
                              <input
                                type="text"
                                value={dataVal}
                                onChange={(e) => updateDataValue(sIdx, rIdx, dIdx, e.target.value)}
                                className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                placeholder="0"
                              />
                            </td>
                          ))}
                          <td className="border border-gray-600 p-1 bg-yellow-950">
                            <input
                              type="text"
                              value={row.uncertainty}
                              onChange={(e) => updateRowField(sIdx, rIdx, 'uncertainty', e.target.value)}
                              className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                              placeholder="±0.01"
                            />
                          </td>
                          <td className="border border-gray-600 p-1 bg-orange-950">
                            <input
                              type="text"
                              value={row.marginOfError}
                              onChange={(e) => updateRowField(sIdx, rIdx, 'marginOfError', e.target.value)}
                              className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                              placeholder="±0.5%"
                            />
                          </td>
                          <td className="border border-gray-600 p-1 bg-purple-950">
                            <input
                              type="text"
                              value={row.remarks}
                              onChange={(e) => updateRowField(sIdx, rIdx, 'remarks', e.target.value)}
                              className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                              placeholder="Pass"
                            />
                          </td>
                          <td className="border border-gray-600 px-2 py-1 text-center">
                            <button
                              onClick={() => removeRow(sIdx, rIdx)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addSection}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Add Section
        </button>

        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <button
            onClick={saveTemplate}
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              'Save Template'
            )}
          </button>
          
          {message.type === 'success' && (
            <div className="mt-3 p-3 rounded bg-green-900 border border-green-700 text-green-200 text-sm text-center">
              ✅ {message.text}
            </div>
          )}
          
          {message.type === 'error' && (
            <div className="mt-3 p-3 rounded bg-red-900 border border-red-700 text-red-200 text-sm text-center">
              ❌ {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dmm_Template;