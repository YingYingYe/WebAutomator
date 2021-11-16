import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

import { Grid, Button } from '@material-ui/core';
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DialogEdit from '../../../components/DialogEdit/Artefact';

import { useDispatch } from "react-redux";
import { setListItem } from "../../../store/reducers/listitem";

import * as ApiDB from "../../../api/db";
import * as ApiFunction from "../../../api/function";


const Artefact = () => {
  const dispatch = useDispatch();
  dispatch(setListItem(3));
  
  const FormElementProps = {
    fullWidth: true,
    variant: "standard",
    size: "medium",
    className: "mb-4"
  }
  
  const [rows, setRows] = useState([]);
  const [editd, setEditd] = useState(false);
  const [selectedrow, setSelectedrow] = useState(null);

  const saveEvent = async() => {
    try{
      console.log(rows);
      const bulkSavePromise = [];
      rows.forEach(row => {
        if(row.saveaction === "create"){
          bulkSavePromise.push(ApiFunction.createArtefactAction(row));
        }else if(row.saveaction === "overwrite"){
          bulkSavePromise.push(ApiFunction.overwriteArtefactAction(row));
        }else if(row.saveaction === "merge"){
          bulkSavePromise.push(ApiFunction.mergeArtefactAction(row));
        }
      });
      await Promise.all(bulkSavePromise);
      console.log("all saved");
    }catch(ex){
      return;
    }
  }

  const updateEvent = (index, data) => {
    setRows((prev) => {
      const arr = [...prev];
      arr[index - 1].startdate = data.startdate
      arr[index - 1].enddate = data.enddate
      arr[index - 1].article = data.article
      arr[index - 1].pictures = data.pictures
      return arr;
    });
  }
  
  const fetchSaveList = async() => {
    try{
      const saveListRows = (await ApiDB.getSaveList("artefact")).data.results;
      saveListRows.forEach((element, index) => {
        setRows((prev) => [...prev, {
          id: index + 1, 
          keyword: element.keyword, 
          startdate: element.startdate, 
          enddate: element.enddate, 
          article: element.article,
          pictures: element.pictures,
          saveaction: element.saveaction,
          cridbid: element.cridbid,
          rowid: element.id
        }])
      });
    }catch(ex){}
  }

  const columns = [
    { field: 'id', headerName: 'No', flex: 1, sortable: false,
      renderCell: (params) => {
        return(
          <div style={{marginLeft: "10px"}}>
            {params.row.id}
          </div>
        )
      }
    },
    { 
      field: 'saveaction', 
      headerName: 'Save Action', 
      flex: 2,
      renderCell: (params) => {
        let saveaction;
        if(params.row.saveaction === "create"){
          saveaction = <Chip label="create" size="small" />
        }else if(params.row.saveaction === "overwrite"){
          saveaction = <Chip label="overwrite" size="small" />
        }else if(params.row.saveaction === "merge"){
          saveaction = <Chip label="merge" size="small" />
        }
        return(
          <>
          {saveaction}
          </>
        )
      }
    },
    { field: 'keyword', headerName: 'Keyword', flex: 2 },
    { field: 'startdate', headerName: 'Start Date', flex: 2, type: 'date' },
    { field: 'enddate', headerName: 'End Date', flex: 2, type: 'date' },
    { 
      field: 'action', 
      headerName: 'Action', 
      sortable: false,
      flex: 2,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        
        const onEdit = async() => {
          setSelectedrow(params.row);
          setEditd(true);
        };

        const onDelete = async() => {
          await ApiDB.deleteFromSavelist(params.row.rowid, "artefact");
          setRows((prev) => {
            const arr = [...prev];
            arr.splice(prev.findIndex(item => item.rowid === params.row.rowid), 1);
            return arr;
          });
        };
  
        return (
          <>
            <Button onClick={onEdit}> 
              <EditIcon style={{fontSize: "22"}}/>
            </Button>
            <Button onClick={onDelete}> 
              <DeleteIcon style={{fontSize: "22"}}/>
            </Button>
          </>
        ) 
      } 
    },
  ];
  
  useEffect(() => {
    fetchSaveList();
  }, []);

  return (
    <>
    <Grid container className="px-1 py-3" spacing={5}>
      <Grid item xs={1} md={1}></Grid>
      <Grid item xs={10} md={10}>
        <div className='mb-4' style={{ height: 650, width: '100%', textAlign: 'center' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            isRowSelectable={() => {return false}}
          />
        </div>
        <Grid item xs={12} md={12} align="right">
          <Button variant="outlined" color="primary" size="large" onClick={saveEvent}>
            Save to CRIDB
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={1} md={1}></Grid>
    </Grid>
    <DialogEdit 
      isOpen={editd} 
      FormElementProps={FormElementProps} 
      selectedrow={selectedrow}
      setEditd={setEditd} 
      updateEvent={updateEvent}
    />
    </>
  );
}

export default Artefact;