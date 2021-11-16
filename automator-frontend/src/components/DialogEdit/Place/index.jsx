import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  TextField,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import * as ApiDB from "../../../api/db"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const Place = (props) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [article, setArticle] = useState("");
  const [pictures, setPictures] = useState("");
  const [id, setId] = useState(null);
  const [rowid, setRowid] = useState(null);

  const cancelClose = () => {
    props.setEditd(false);
  };

  const saveClose = async() => {
    props.setEditd(false);
    const updatedData = {
      "rowid": rowid, 
      "latitude": latitude, 
      "longitude": longitude, 
      "article": article, 
      "pictures": pictures
    }
    props.updateEvent(id, updatedData);
    await ApiDB.updateToSavelist(updatedData, "place");
  };
  
  useEffect(() => {
    if(props.selectedrow !== null){
      setLatitude(props.selectedrow.latitude);
      setLongitude(props.selectedrow.longitude);
      setArticle(props.selectedrow.article);
      setPictures(props.selectedrow.pictures);
      setId(props.selectedrow.id);
      setRowid(props.selectedrow.rowid);
    }
  }, [props.selectedrow]);

  return (
    <div>
      <BootstrapDialog
        onClose={cancelClose}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={cancelClose}>
          Edit Person
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container className="px-1 py-3">
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <TextField
                  {...props.FormElementProps}                                    
                  label="Latitude"
                  value={latitude}
                  onChange={e => {
                    setLatitude(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  {...props.FormElementProps}                                    
                  label="Longitude"
                  value={longitude}
                  onChange={e => {
                    setLongitude(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField 
                {...props.FormElementProps}
                label="Article"
                multiline
                rows={8}
                value={article}
                onChange={e => {
                  setArticle(e.target.value);
                }}
              />
              <TextField 
                {...props.FormElementProps}
                label="Downloadable Image URL"
                multiline
                rows={8}
                value={pictures}
                onChange={e => {
                  setPictures(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={saveClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Place;