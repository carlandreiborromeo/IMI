// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';

// const TemplateManagement = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [editingTemplate, setEditingTemplate] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchTemplates();
//   }, []);
 
//   const fetchTemplates = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/Templates/getAllTemplates');
//       setTemplates(response.data.data);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to fetch templates' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTemplate = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this template?')) return;

//     try {
//       await api.delete(`/Templates/deleteTemplate/${id}`);
//       setMessage({ type: 'success', text: 'Template deleted successfully' });
//       fetchTemplates();
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to delete template' });
//     }
//   };

//   const startEdit = async (templateSummary) => {
//     try {
//       const response = await api.get(`/Templates/getTemplate/${templateSummary._id}`);
//       if (response.data.success) {
//         setEditingTemplate(response.data.data);
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load template for editing' });
//     }
//   };

//   const cancelEdit = () => {
//     setEditingTemplate(null);
//   };

//   const updateSectionName = (sectionIdx, value) => {
//     const newSections = [...editingTemplate.sections];
//     newSections[sectionIdx].sectionName = value;
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const updateDataColumns = (sectionIdx, value) => {
//     const newSections = [...editingTemplate.sections];
//     const numColumns = parseInt(value) || 1;
//     const oldColumns = newSections[sectionIdx].dataColumns;
    
//     newSections[sectionIdx].dataColumns = numColumns;
    
//     newSections[sectionIdx].rows.forEach(row => {
//       if (numColumns > oldColumns) {
//         const diff = numColumns - oldColumns;
//         row.dataValues.push(...Array(diff).fill(''));
//       } else if (numColumns < oldColumns) {
//         row.dataValues = row.dataValues.slice(0, numColumns);
//       }
//     });
    
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const addRow = (sectionIdx) => {
//     const newSections = [...editingTemplate.sections];
//     const numDataColumns = newSections[sectionIdx].dataColumns;
    
//     const newRow = {
//       appliedValue: '',
//       unit: '',
//       dataValues: Array(numDataColumns).fill(''),
//       uncertainty: '',
//       marginOfError: '',
//       remarks: ''
//     };
    
//     newSections[sectionIdx].rows.push(newRow);
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const removeRow = (sectionIdx, rowIdx) => {
//     const newSections = [...editingTemplate.sections];
//     newSections[sectionIdx].rows.splice(rowIdx, 1);
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const updateRowField = (sectionIdx, rowIdx, field, value) => {
//     const newSections = [...editingTemplate.sections];
//     newSections[sectionIdx].rows[rowIdx][field] = value;
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const updateDataValue = (sectionIdx, rowIdx, dataIdx, value) => {
//     const newSections = [...editingTemplate.sections];
//     newSections[sectionIdx].rows[rowIdx].dataValues[dataIdx] = value;
//     setEditingTemplate({ ...editingTemplate, sections: newSections });
//   };

//   const saveEdit = async () => {
//     setLoading(true);
//     try {
//       await api.put(`/Templates/updateTemplate/${editingTemplate._id}`, {
//         equipmentName: editingTemplate.equipmentName,
//         sections: editingTemplate.sections
//       });
      
//       setMessage({ type: 'success', text: 'Template updated successfully' });
//       setEditingTemplate(null);
//       fetchTemplates();
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to update template' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredTemplates = templates.filter(t => 
//     t.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (editingTemplate) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-bold text-blue-400">Edit Template</h2>
//               <button
//                 onClick={cancelEdit}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>

//           <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
//             <label className="block text-sm font-semibold text-gray-300 mb-2">Equipment Name</label>
//             <input
//               type="text"
//               value={editingTemplate.equipmentName}
//               onChange={(e) => setEditingTemplate({ ...editingTemplate, equipmentName: e.target.value })}
//               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           {editingTemplate.sections.map((section, sIdx) => (
//             <div key={sIdx} className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
//               <h3 className="text-lg font-semibold text-blue-400 mb-3">Section {sIdx + 1}</h3>

//               <div className="mb-3">
//                 <label className="block text-xs text-gray-400 mb-1">Section Name</label>
//                 <input
//                   type="text"
//                   value={section.sectionName}
//                   onChange={(e) => updateSectionName(sIdx, e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="block text-xs text-gray-400 mb-1">Number of Data Columns</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="20"
//                   value={section.dataColumns}
//                   onChange={(e) => updateDataColumns(sIdx, e.target.value)}
//                   className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm focus:border-blue-500 focus:outline-none"
//                 />
//               </div>

//               <div className="mb-3">
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block text-xs text-gray-400">Test Points</label>
//                   <button
//                     onClick={() => addRow(sIdx)}
//                     className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
//                   >
//                     + Add Row
//                   </button>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse text-xs">
//                     <thead>
//                       <tr className="bg-gray-700">
//                         <th className="border border-gray-600 px-2 py-1">#</th>
//                         <th className="border border-gray-600 px-2 py-1">Applied Value</th>
//                         <th className="border border-gray-600 px-2 py-1">Unit</th>
//                         {Array.from({ length: section.dataColumns }, (_, i) => (
//                           <th key={i} className="border border-gray-600 px-2 py-1 bg-blue-900">DATA {i + 1}</th>
//                         ))}
//                         <th className="border border-gray-600 px-2 py-1 bg-yellow-900">Uncertainty</th>
//                         <th className="border border-gray-600 px-2 py-1 bg-orange-900">Margin</th>
//                         <th className="border border-gray-600 px-2 py-1 bg-purple-900">Remarks</th>
//                         <th className="border border-gray-600 px-2 py-1">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {section.rows && section.rows.length > 0 ? (
//                         section.rows.map((row, rIdx) => (
//                           <tr key={rIdx}>
//                             <td className="border border-gray-600 px-2 py-1 text-center text-gray-400">{rIdx + 1}</td>
//                             <td className="border border-gray-600 p-1">
//                               <input
//                                 type="text"
//                                 value={row.appliedValue || ''}
//                                 onChange={(e) => updateRowField(sIdx, rIdx, 'appliedValue', e.target.value)}
//                                 className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                               />
//                             </td>
//                             <td className="border border-gray-600 p-1">
//                               <input
//                                 type="text"
//                                 value={row.unit || ''}
//                                 onChange={(e) => updateRowField(sIdx, rIdx, 'unit', e.target.value)}
//                                 className="w-12 px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                               />
//                             </td>
//                             {(row.dataValues || []).map((dataVal, dIdx) => (
//                               <td key={dIdx} className="border border-gray-600 p-1 bg-blue-950">
//                                 <input
//                                   type="text"
//                                   value={dataVal || ''}
//                                   onChange={(e) => updateDataValue(sIdx, rIdx, dIdx, e.target.value)}
//                                   className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                                 />
//                               </td>
//                             ))}
//                             <td className="border border-gray-600 p-1 bg-yellow-950">
//                               <input
//                                 type="text"
//                                 value={row.uncertainty || ''}
//                                 onChange={(e) => updateRowField(sIdx, rIdx, 'uncertainty', e.target.value)}
//                                 className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                               />
//                             </td>
//                             <td className="border border-gray-600 p-1 bg-orange-950">
//                               <input
//                                 type="text"
//                                 value={row.marginOfError || ''}
//                                 onChange={(e) => updateRowField(sIdx, rIdx, 'marginOfError', e.target.value)}
//                                 className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                               />
//                             </td>
//                             <td className="border border-gray-600 p-1 bg-purple-950">
//                               <input
//                                 type="text"
//                                 value={row.remarks || ''}
//                                 onChange={(e) => updateRowField(sIdx, rIdx, 'remarks', e.target.value)}
//                                 className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
//                               />
//                             </td>
//                             <td className="border border-gray-600 px-2 py-1 text-center">
//                               <button
//                                 onClick={() => removeRow(sIdx, rIdx)}
//                                 className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
//                               >
//                                 Del
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="100" className="border border-gray-600 px-2 py-4 text-center text-gray-500">
//                             No rows in this section
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
//             <button
//               onClick={saveEdit}
//               disabled={loading}
//               className={`w-full ${loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-lg`}
//             >
//               {loading ? 'Saving...' : '💾 Save Changes'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
//           <h1 className="text-2xl font-bold text-blue-400">Template Management</h1>
//           <p className="text-gray-400 text-sm mt-1">Manage existing calibration templates</p>
//         </div>

//         {message.text && (
//           <div className={`mb-4 p-3 rounded border ${
//             message.type === 'success' 
//               ? 'bg-green-900 border-green-700 text-green-200' 
//               : 'bg-red-900 border-red-700 text-red-200'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
//           <input
//             type="text"
//             placeholder="Search templates by equipment name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:border-blue-500 focus:outline-none"
//           />
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="text-gray-400 mt-4">Loading templates...</p>
//           </div>
//         ) : filteredTemplates.length === 0 ? (
//           <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg text-center">
//             <p className="text-gray-400">No templates found</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredTemplates.map((template) => (
//               <div key={template._id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-blue-400">{template.equipmentName}</h3>
//                     <div className="mt-2 space-y-1 text-sm text-gray-400">
//                       <p>Sections: {template.sectionsCount}</p>
//                       <p>Total Test Points: {template.totalTestPoints}</p>
//                       <p className="text-xs text-gray-500">Created: {new Date(template.createdAt).toLocaleString()}</p>
//                     </div>
//                     <div className="mt-2">
//                       {template.sections.map((section, idx) => (
//                         <div key={idx} className="text-xs text-gray-500 mt-1">
//                           • {section.sectionName} ({section.dataColumns} data cols, {section.testPointsCount} points)
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex gap-2 ml-4">
//                     <button
//                       onClick={() => startEdit(template)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteTemplate(template._id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateManagement;

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);
 
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Templates/getAllTemplates');
      setTemplates(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch templates' });
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await api.delete(`/Templates/deleteTemplate/${id}`);
      setMessage({ type: 'success', text: 'Template deleted successfully' });
      fetchTemplates();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete template' });
    }
  };

  const startEdit = async (templateSummary) => {
    try {
      const response = await api.get(`/Templates/getTemplate/${templateSummary._id}`);
      if (response.data.success) {
        setEditingTemplate(response.data.data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load template for editing' });
    }
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
  };

  const addSection = () => {
    setEditingTemplate({
      ...editingTemplate,
      sections: [
        ...editingTemplate.sections,
        {
          sectionName: '',
          dataColumns: 5,
          rows: []
        }
      ]
    });
  };

  const removeSection = (sectionIdx) => {
    const newSections = editingTemplate.sections.filter((_, idx) => idx !== sectionIdx);
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const updateSectionName = (sectionIdx, value) => {
    const newSections = [...editingTemplate.sections];
    newSections[sectionIdx].sectionName = value;
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const updateDataColumns = (sectionIdx, value) => {
    const newSections = [...editingTemplate.sections];
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
    
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const addRow = (sectionIdx) => {
    const newSections = [...editingTemplate.sections];
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
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const removeRow = (sectionIdx, rowIdx) => {
    const newSections = [...editingTemplate.sections];
    newSections[sectionIdx].rows.splice(rowIdx, 1);
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const updateRowField = (sectionIdx, rowIdx, field, value) => {
    const newSections = [...editingTemplate.sections];
    newSections[sectionIdx].rows[rowIdx][field] = value;
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const updateDataValue = (sectionIdx, rowIdx, dataIdx, value) => {
    const newSections = [...editingTemplate.sections];
    newSections[sectionIdx].rows[rowIdx].dataValues[dataIdx] = value;
    setEditingTemplate({ ...editingTemplate, sections: newSections });
  };

  const saveEdit = async () => {
    if (!editingTemplate.equipmentName.trim()) {
      setMessage({ type: 'error', text: 'Please enter an equipment name' });
      return;
    }

    if (editingTemplate.sections.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one section' });
      return;
    }

    for (let section of editingTemplate.sections) {
      if (!section.sectionName.trim()) {
        setMessage({ type: 'error', text: 'All sections must have a name' });
        return;
      }

      if (section.dataColumns < 1) {
        setMessage({ type: 'error', text: 'Each section must have at least 1 data column' });
        return;
      }

      if (section.rows.length === 0) {
        setMessage({ type: 'error', text: `Section "${section.sectionName}" must have at least one row` });
        return;
      }

      for (let i = 0; i < section.rows.length; i++) {
        const row = section.rows[i];

        if (!row.appliedValue.trim()) {
          setMessage({ type: 'error', text: `Row ${i + 1} in "${section.sectionName}" requires an Applied Value` });
          return;
        }

        if (!row.unit.trim()) {
          setMessage({ type: 'error', text: `Row ${i + 1} in "${section.sectionName}" requires a Unit` });
          return;
        }
      }
    }

    setLoading(true);
    try {
      await api.put(`/Templates/updateTemplate/${editingTemplate._id}`, {
        equipmentName: editingTemplate.equipmentName,
        sections: editingTemplate.sections
      });
      
      setMessage({ type: 'success', text: 'Template updated successfully' });
      setEditingTemplate(null);
      fetchTemplates();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update template' });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (editingTemplate) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-400">Edit Template</h2>
              <button
                onClick={cancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`mb-4 p-3 rounded border ${
              message.type === 'success' 
                ? 'bg-green-900 border-green-700 text-green-200' 
                : 'bg-red-900 border-red-700 text-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Equipment Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editingTemplate.equipmentName}
              onChange={(e) => setEditingTemplate({ ...editingTemplate, equipmentName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {editingTemplate.sections.map((section, sIdx) => (
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
                          <th className="border border-gray-600 px-2 py-1">
                            Applied Value <span className="text-red-500">*</span>
                          </th>
                          <th className="border border-gray-600 px-2 py-1">
                            Unit <span className="text-red-500">*</span>
                          </th>
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
                                value={row.appliedValue || ''}
                                onChange={(e) => updateRowField(sIdx, rIdx, 'appliedValue', e.target.value)}
                                className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                placeholder="100"
                                required
                              />
                            </td>
                            <td className="border border-gray-600 p-1">
                              <input
                                type="text"
                                value={row.unit || ''}
                                onChange={(e) => updateRowField(sIdx, rIdx, 'unit', e.target.value)}
                                className="w-12 px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                placeholder="mV"
                                required
                              />
                            </td>
                            {(row.dataValues || []).map((dataVal, dIdx) => (
                              <td key={dIdx} className="border border-gray-600 p-1 bg-blue-950">
                                <input
                                  type="text"
                                  value={dataVal || ''}
                                  onChange={(e) => updateDataValue(sIdx, rIdx, dIdx, e.target.value)}
                                  className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                  placeholder="0"
                                />
                              </td>
                            ))}
                            <td className="border border-gray-600 p-1 bg-yellow-950">
                              <input
                                type="text"
                                value={row.uncertainty || ''}
                                onChange={(e) => updateRowField(sIdx, rIdx, 'uncertainty', e.target.value)}
                                className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                placeholder="±0.01"
                              />
                            </td>
                            <td className="border border-gray-600 p-1 bg-orange-950">
                              <input
                                type="text"
                                value={row.marginOfError || ''}
                                onChange={(e) => updateRowField(sIdx, rIdx, 'marginOfError', e.target.value)}
                                className="w-full px-1 py-1 bg-gray-700 border-0 rounded text-gray-100"
                                placeholder="±0.5%"
                              />
                            </td>
                            <td className="border border-gray-600 p-1 bg-purple-950">
                              <input
                                type="text"
                                value={row.remarks || ''}
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
              onClick={saveEdit}
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-blue-400">Template Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage existing calibration templates</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded border ${
            message.type === 'success' 
              ? 'bg-green-900 border-green-700 text-green-200' 
              : 'bg-red-900 border-red-700 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-4">
          <input
            type="text"
            placeholder="Search templates by equipment name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg text-center">
            <p className="text-gray-400">No templates found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div key={template._id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-400">{template.equipmentName}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-400">
                      <p>Sections: {template.sectionsCount}</p>
                      <p>Total Test Points: {template.totalTestPoints}</p>
                      <p className="text-xs text-gray-500">Created: {new Date(template.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="mt-2">
                      {template.sections.map((section, idx) => (
                        <div key={idx} className="text-xs text-gray-500 mt-1">
                          • {section.sectionName} ({section.dataColumns} data cols, {section.testPointsCount} points)
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(template)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTemplate(template._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManagement;