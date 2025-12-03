const { useState } = React;

function PhotoToPDFApp() {
const [images, setImages] = useState([]);
const [reportTitle, setReportTitle] = useState(’’);
const [reportNotes, setReportNotes] = useState(’’);
const [generating, setGenerating] = useState(false);

const handleImageSelect = (e) => {
const files = Array.from(e.target.files);

```
files.forEach(file => {
  const reader = new FileReader();
  reader.onload = (event) => {
    setImages(prev => [...prev, {
      id: Date.now() + Math.random(),
      src: event.target.result,
      name: file.name
    }]);
  };
  reader.readAsDataURL(file);
});
```

};

const removeImage = (id) => {
setImages(prev => prev.filter(img => img.id !== id));
};

const generatePDF = async () => {
if (images.length === 0) {
alert(‘Please add at least one image’);
return;
}

```
setGenerating(true);

try {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const { jsPDF } = window.jspdf;
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  pdf.setFontSize(24);
  pdf.text(reportTitle || 'Photo Report', margin, 40);
  
  if (reportNotes) {
    pdf.setFontSize(12);
    const splitNotes = pdf.splitTextToSize(reportNotes, pageWidth - (margin * 2));
    pdf.text(splitNotes, margin, 60);
  }

  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 20);

  for (let i = 0; i < images.length; i++) {
    pdf.addPage();
    
    const img = images[i];
    const imgData = img.src;

    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 3);
    
    try {
      pdf.addImage(imgData, 'JPEG', margin, margin, maxWidth, maxHeight, undefined, 'FAST');
    } catch (e) {
      console.error('Error adding image:', e);
    }

    pdf.setFontSize(10);
    pdf.text(`Image ${i + 1} of ${images.length}`, margin, pageHeight - 20);
  }

  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  const fileName = `${reportTitle.replace(/\s+/g, '_') || 'report'}_${Date.now()}.pdf`;
  
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  link.click();

  setTimeout(() => {
    alert('PDF downloaded! You can now:\n1. Open the Files app\n2. Find the PDF in Downloads\n3. Tap Share and select Mail');
  }, 500);

} catch (error) {
  console.error('Error generating PDF:', error);
  alert('Error generating PDF. Please try again.');
} finally {
  setGenerating(false);
}
```

};

return React.createElement(‘div’, { className: “min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4” },
React.createElement(‘div’, { className: “max-w-2xl mx-auto” },
React.createElement(‘div’, { className: “bg-white rounded-lg shadow-lg p-6 mb-4” },
React.createElement(‘div’, { className: “flex items-center gap-3 mb-2” },
React.createElement(‘svg’, { className: “w-8 h-8 text-indigo-600”, fill: “none”, stroke: “currentColor”, viewBox: “0 0 24 24” },
React.createElement(‘path’, { strokeLinecap: “round”, strokeLinejoin: “round”, strokeWidth: 2, d: “M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z” })
),
React.createElement(‘h1’, { className: “text-2xl font-bold text-gray-800” }, ‘Photo Report’)
),
React.createElement(‘p’, { className: “text-gray-600 text-sm” }, ‘Create PDF reports from your photos’)
),

```
  React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6 mb-4" },
    React.createElement('h2', { className: "text-lg font-semibold text-gray-800 mb-4" }, 'Report Details'),
    React.createElement('div', { className: "space-y-4" },
      React.createElement('div', null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Report Title'),
        React.createElement('input', {
          type: "text",
          value: reportTitle,
          onChange: (e) => setReportTitle(e.target.value),
          placeholder: "Enter report title...",
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        })
      ),
      React.createElement('div', null,
        React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, 'Notes (Optional)'),
        React.createElement('textarea', {
          value: reportNotes,
          onChange: (e) => setReportNotes(e.target.value),
          placeholder: "Add any notes or description...",
          rows: 3,
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        })
      )
    )
  ),
  
  React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6 mb-4" },
    React.createElement('h2', { className: "text-lg font-semibold text-gray-800 mb-4" }, 'Photos'),
    React.createElement('label', { className: "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors" },
      React.createElement('div', { className: "flex flex-col items-center justify-center pt-5 pb-6" },
        React.createElement('svg', { className: "w-10 h-10 text-indigo-500 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" })
        ),
        React.createElement('p', { className: "text-sm text-gray-600" }, 'Tap to add photos'),
        React.createElement('p', { className: "text-xs text-gray-500" }, 'From camera or gallery')
      ),
      React.createElement('input', {
        type: "file",
        accept: "image/*",
        multiple: true,
        capture: "environment",
        onChange: handleImageSelect,
        className: "hidden"
      })
    ),
    
    images.length > 0 && React.createElement('div', { className: "grid grid-cols-2 gap-4 mt-4" },
      images.map((img) =>
        React.createElement('div', { key: img.id, className: "relative group" },
          React.createElement('img', {
            src: img.src,
            alt: img.name,
            className: "w-full h-40 object-cover rounded-lg"
          }),
          React.createElement('button', {
            onClick: () => removeImage(img.id),
            className: "absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          },
            React.createElement('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
              React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
            )
          )
        )
      )
    ),
    
    images.length > 0 && React.createElement('p', { className: "text-sm text-gray-600 mt-4" },
      `${images.length} photo${images.length !== 1 ? 's' : ''} added`
    )
  ),
  
  React.createElement('button', {
    onClick: generatePDF,
    disabled: generating || images.length === 0,
    className: "w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
  },
    generating ? [
      React.createElement('div', { key: 'spinner', className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
      React.createElement('span', { key: 'text' }, 'Generating PDF...')
    ] : [
      React.createElement('svg', { key: 'icon', className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })
      ),
      React.createElement('span', { key: 'text' }, 'Generate PDF Report')
    ]
  ),
  
  React.createElement('p', { className: "text-center text-sm text-gray-600 mt-4" },
    'PDF will be saved to your device. Use the Share menu to email it.'
  )
)
```

);
}

ReactDOM.render(React.createElement(PhotoToPDFApp), document.getElementById(‘root’));
