import pandas as pd
from js import document, Blob, URL

def excel_to_vcf(excel_data_url):
    try:
        # Convert the data URL to a pandas DataFrame
        df = pd.read_excel(excel_data_url)
        
        # Check if required columns are present
        if 'Name' not in df.columns or 'Phone' not in df.columns:
            raise ValueError("The Excel sheet must contain 'Name' and 'Phone' columns.")
        
        # Prepare the VCF data
        vcf_content = ""
        for index, row in df.iterrows():
            name = row['Name']
            phone = row['Phone']
            
            # Skip entry if name or phone is missing
            if pd.isna(name) or pd.isna(phone):
                continue
            
            vcf_content += 'BEGIN:VCARD\n'
            vcf_content += 'VERSION:3.0\n'
            vcf_content += f'FN:{name}\n'
            vcf_content += f'TEL;TYPE=CELL:{phone}\n'
            vcf_content += 'END:VCARD\n'
        
        # Create a Blob and a download link
        blob = Blob.new([vcf_content], {type: 'text/vcard'})
        link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'contacts.vcf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        document.getElementById('loader').style.display = 'none'
        document.getElementById('downloadButton').style.display = 'block'
    except Exception as e:
        print(f"An error occurred: {e}")

def process_file(file):
    reader = pd.ExcelFile(file)
    return reader.parse(sheet_name=0)
