import React, {useState} from 'react'
import { 
    TextField, 
    Grid, 
    Button, 
    Typography, 
} from '@material-ui/core';

import { SnackbarProvider, useSnackbar } from 'notistack';

import CircleLoading from "../CircleLoading";
import * as ApiDB from "../../api/db"
import * as ApiCRIDB from "../../api/cridb";
import * as ApiFunction from "../../api/function";

import DialogCompare from '../../components/DialogCompare/Artefact';


const Artefact = ({ func, data, FormElementProps }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isOpen, setIsOpen] = useState(false);
    const [duplicatedRec, setDuplicatedRec] = useState([]);

    const saveToSavelist = () => async() => {
        try{
            await ApiCRIDB.searchThing({query: ApiFunction.keywordFormat(data.keyword)}).then((res) => {
                const duplicates = res.data.records.filter((record)=>{
                    return record.subtype === "artefact";
                });
                if(duplicates.length > 0){
                    setDuplicatedRec(duplicates);
                }
            });
            setIsOpen(true);
        }catch(ex){}
        
    }

    const saveClose = async(saveAction, cridbId, variant) => {
        const params = [
            data.keyword, 
            data.artefact.startdate, 
            data.artefact.enddate, 
            data.artefact.article, 
            data.artefact.downloadableImageURL,
            saveAction,
            cridbId
        ];
        try {
            await ApiDB.saveToSavelist(params, "artefact").then(res => {
                if(res.status === 200){
                    enqueueSnackbar('The current record is successfully saved to Save List!', { variant });
                }
            });
        } catch (ex) {}
    }

    return (
        <>
        <Typography variant="h6" align="left" style={{paddingBottom: "1.25rem"}}>Result</Typography> 
        <Grid container spacing={1}>
            <>
            {
                data.artefactLoading ? <CircleLoading /> :
                <>
                    {/* Start and End Date */}                
                    <Grid container spacing={5}>
                        <Grid item xs={6} md={6}>
                            <TextField 
                                {...FormElementProps}                                    
                                label="Start Date"
                                value={data.artefact.startDate}
                                onChange={e => func.setArtefactForm('startDate', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField 
                                {...FormElementProps}
                                label="End Date"
                                value={data.artefact.endDate}
                                onChange={e => func.setArtefactForm('endDate', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {/* Article */}
                    <TextField 
                        {...FormElementProps}
                        label="Article"
                        multiline
                        rows={8}
                        value={data.artefact.article}
                        onChange={e => func.setArtefactForm('article', e.target.value)}
                    />
                    {/* Downloadable Image URL */}
                    <TextField 
                        {...FormElementProps}
                        label="Downloadable Image URL"
                        multiline
                        rows={8}
                        value={data.artefact.downloadableImageURL}
                        onChange={e => func.setArtefactForm('downloadableImageURL', e.target.value)}
                    />
                </>
            }
            </>
            {/* Save Action */}
            <Grid container className="mt-4">
                <Grid item xs={8} md={8}></Grid>
                <Grid item xs={4} md={4} align="right">
                    <Button variant="outlined" color="primary" size="large" className="mt-2" onClick={saveToSavelist()}>
                        Compare
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        <DialogCompare 
            FormElementProps={FormElementProps} 
            isOpen={isOpen} 
            duplicatedRec={duplicatedRec}
            setIsOpen={setIsOpen} 
            saveClose={saveClose}
            data={data}
            func={func}
        />
        </>                                             
    );
}

export default function IntegrationNotistack(props) {
    return (
        <SnackbarProvider maxSnack={3}>
            <Artefact {...props}/>
        </SnackbarProvider>
    );
}