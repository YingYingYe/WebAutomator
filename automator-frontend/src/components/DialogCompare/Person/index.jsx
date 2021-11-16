import React, {
  useState
} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';


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

const Person = (props) => {
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [duplicatedId, setDuplicatedId] = useState("");

  const onSaveActionChange = (saveAction) => {
    if(saveAction === "create"){
      setShowDuplicates(false);
      setDuplicatedId("");
    }else if(saveAction === "overwrite"){
      setShowDuplicates(true);
    }else if(saveAction === "merge"){
      setShowDuplicates(true);
    }
  }

  const cancelClose = () => {
    props.setIsOpen(false);
  };

  const saveToAddListClose = () => {
    if(!(props.data.saveAction!=="create" && duplicatedId === "")){
      props.setIsOpen(false);
      props.saveClose(props.data.saveAction, duplicatedId, "success");
    }
  };

  const saveToCRIDB = () => {
    if(!(props.data.saveAction!=="create" && duplicatedId === "")){
      props.setIsOpen(false); 
      props.func.saveForm(duplicatedId);
    }
  }

  return (
    <div>
      <BootstrapDialog
        onClose={cancelClose}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={cancelClose}>
          Duplicates
        </BootstrapDialogTitle>
        <DialogContent dividers style={{width: "350px"}}>
          <Grid container className="px-1">
            <Grid item xs={12} md={12}>
              <FormControl {...props.FormElementProps}  className="mt-4 mb-4">
                <InputLabel id="Save Action">Save Action</InputLabel>
                <Select 
                  label="Save Action"
                  value={props.data.saveAction}
                  onChange={e => {onSaveActionChange(e.target.value); props.func.setSaveAction(e.target.value);}}
                >
                  <MenuItem value="create">Create</MenuItem>
                  <MenuItem value="overwrite">Overwrite</MenuItem>
                  <MenuItem value="merge">Merge</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <>
            {
              showDuplicates ?
              <Grid container className="px-1 py-3">
                <Grid item xs={12} md={12}>
                  <FormControl {...props.FormElementProps}>
                    <InputLabel id="duplcatedRecords">Select a duplicated record</InputLabel>
                    <Select 
                      label="Duplicated Records"
                      value={duplicatedId}
                      onChange={e => {setDuplicatedId(e.target.value)}}
                    >
                      {
                        props.duplicatedRec.map((element, i) => <MenuItem value={element.id} key={i}>{element.name}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              : <></>
            }
          </>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item xs={6} md={6}>
              <Button autoFocus onClick={saveToAddListClose}>
                Add to Save List
              </Button>
            </Grid>
            <Grid item xs={6} md={6} style={{textAlign: "right"}}>
              <Button onClick={saveToCRIDB}>
                Save to CRIDB
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Person;