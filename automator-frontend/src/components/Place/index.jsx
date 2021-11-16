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
import * as ApiCRIDB from "../../api/cridb"
import * as ApiFunction from "../../api/function"

import DialogCompare from '../../components/DialogCompare/Place';


const Place = ({ func, data, FormElementProps }) => {    
    const { enqueueSnackbar } = useSnackbar();
    const [isOpen, setIsOpen] = useState(false);
    const [duplicatedRec, setDuplicatedRec] = useState([]);

    const saveToSavelist = () => async() => {
        try{
            await ApiCRIDB.searchThing({query: ApiFunction.keywordFormat(data.keyword)}).then((res) => {
                const duplicates = res.data.records.filter((record)=>{
                    return record.subtype === "place";
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
            data.place.latitude, 
            data.place.longitude, 
            data.place.article, 
            data.place.downloadableImageURL,
            saveAction,
            cridbId
        ];
        try {
            await ApiDB.saveToSavelist(params, "place").then(res => {
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
                    data.placeLoading ? <CircleLoading /> :
                    <>
                        {/* Coordinate */}
                        <Grid container spacing={5}>
                            <Grid item xs={6} md={6}>
                                <TextField 
                                    {...FormElementProps}                                    
                                    label="Latitude"
                                    value={data.place.latitude}
                                    onChange={e => func.setPlaceForm('latitude', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <TextField 
                                    {...FormElementProps}
                                    label="Longitude"
                                    value={data.place.longitude}
                                    onChange={e => func.setPlaceForm('longitude', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        {/* Article */}
                        <TextField 
                            {...FormElementProps}
                            label={"Article"}
                            multiline
                            rows={8}
                            value={data.place.article}
                            onChange={e => func.setPlaceForm('article', e.target.value)}
                        />
                        {/* Downloadable Image URL */}
                        <TextField 
                            {...FormElementProps}
                            label="Downloadable Image URL"
                            multiline
                            rows={8}
                            value={data.place.downloadableImageURL}
                            onChange={e => func.setPlaceForm('downloadableImageURL', e.target.value)}
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
            <Place {...props}/>
        </SnackbarProvider>
    );
}
