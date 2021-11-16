import React from 'react'

import {useDropzone} from 'react-dropzone';
import { Button } from '@material-ui/core';
import { Divider } from '@mui/material';

import styles from './index.module.css';

// import * as XLSX from '../../api/importexcel'

import * as XLSX from 'xlsx';



function Dropzone(props) {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noKeyboard: true});
  const files = acceptedFiles.map(file => {
    if(file.path.indexOf(".xlsx") > -1){
      return <li key={file.path}>{file.path}</li>
    }else{
      return null;
    }
  });

  const onAnalyse = async() => {
    const f = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => { // evt = on_file_select event
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        
        let data = [];
        for (const sheet in wb.Sheets) {
          console.log("sheet =>", sheet);
          if (wb.Sheets.hasOwnProperty(sheet)) {
            data.push({sheet: {...XLSX.utils.sheet_to_json(wb.Sheets[sheet])}});
          }
        }
        /* Update state */
        console.log("Data >>>", data);
    };
    reader.readAsBinaryString(f);
  }

  return (
    <section className={styles.container}>
      <div {...getRootProps({className: styles.dropzone})}>
        <input {...getInputProps()} multiple={false}/>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h6>Files: </h6>
        <ul>{files}</ul>
        <Divider light />
        <div align="right">
          <Button variant="outlined" color="primary" size="large" className="mt-3" onClick={onAnalyse}>Analyse</Button>
        </div>
      </aside>
    </section>
  );
}


function ImportExcel() {
  
  return (
    <>
      <Dropzone/>
    </>
  )
}

export default ImportExcel
