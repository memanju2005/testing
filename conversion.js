const file=''
if (file) 
    {
        console.log('Selected file:', file.name);
        document.getElementById('loader').style.display = 'block';
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const vcfData = convertToVCF(json);
            
            // Create a downloadable VCF file
            const blob = new Blob([vcfData], { type: 'text/vcard' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'contacts.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            document.getElementById('loader').style.display = 'none';
            document.getElementById('downloadButton').style.display = 'block';
        };
        reader.readAsArrayBuffer(file);
    }

function convertToVCF(json) 
{
    let vcf = '';
    json.forEach(contact => {
        vcf += 'BEGIN:VCARD\n';
        vcf += 'VERSION:3.0\n';
        if (contact['First Name'] && contact['Last Name']) {
            vcf += `N:${contact['Last Name']};${contact['First Name']};;;\n`;
            vcf += `FN:${contact['First Name']} ${contact['Last Name']}\n`;
        }
        if (contact['Phone']) {
            vcf += `TEL:${contact['Phone']}\n`;
        }
        vcf += 'END:VCARD\n';
    });
    return vcf;
    }
;
