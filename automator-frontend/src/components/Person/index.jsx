import React, {useState} from 'react'
import { 
    Grid, 
    Button, 
    Typography, 
    TextField
} from '@material-ui/core'; 

import { SnackbarProvider, useSnackbar } from 'notistack';

import CircleLoading from "../CircleLoading";
import * as ApiDB from "../../api/db";
import * as ApiCRIDB from "../../api/cridb";
import * as ApiFunction from "../../api/function";

import DialogCompare from '../../components/DialogCompare/Person';


const Person = ({ func, data, FormElementProps }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isOpen, setIsOpen] = useState(false);
    const [duplicatedRec, setDuplicatedRec] = useState([]);

    const saveToSavelist = () => async() => {
        try{
            await ApiCRIDB.searchThing({query: ApiFunction.keywordFormat(data.keyword)}).then((res) => {
                const duplicates = res.data.records.filter((record)=>{
                    return record.subtype === "person";
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
            data.person.birthPlace, 
            data.person.deathPlace, 
            data.person.birthDate, 
            data.person.deathDate, 
            data.person.article, 
            data.person.downloadableImageURL,
            saveAction,
            cridbId
        ];
        try {
            await ApiDB.saveToSavelist(params, "person").then(res => {
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
            {/* Birth and Death Date */}
            <>
                {
                    data.personLoading ? <CircleLoading /> : 
                    <>
                    <Grid container spacing={5}>
                        <Grid item xs={6} md={6}>
                            <TextField
                                {...FormElementProps}                                    
                                label="Birth Date"
                                value={data.person.birthDate}
                                onChange={e => {func.setPersonForm('birthDate', e.target.value);}}
                            />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField 
                                {...FormElementProps}
                                label="Death Date"
                                value={data.person.deathDate}
                                onChange={e => func.setPersonForm('deathDate', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    {/* Birth and Death Place */}
                    <TextField 
                        {...FormElementProps}                                    
                        label="Birth Place"
                        value={data.person.birthPlace}
                        onChange={e => func.setPersonForm('birthPlace', e.target.value)}
                    />
                    <TextField 
                        {...FormElementProps}
                        label="Death Place"
                        value={data.person.deathPlace}
                        onChange={e => func.setPersonForm('deathPlace', e.target.value)}
                    />
                    {/* Article */}
                    <TextField 
                        {...FormElementProps}
                        label="Article"
                        multiline
                        rows={8}
                        value={data.person.article}
                        onChange={e => func.setPersonForm('article', e.target.value)}
                    />
                    {/* Downloadable Image URL */}
                    <TextField 
                        {...FormElementProps}
                        label="Downloadable Image URL"
                        multiline
                        rows={8}
                        value={data.person.downloadableImageURL}
                        onChange={e => func.setPersonForm('downloadableImageURL', e.target.value)}
                    />
                </>
            }
            </>
            {/* Save Action */}
            <Grid container className="mt-4">
                <Grid item xs={8} md={8}></Grid>
                <Grid item xs={4} md={4} align="right">
                    <Button variant="outlined" color="primary" size="large" onClick={saveToSavelist()}>
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
            <Person {...props}/>
        </SnackbarProvider>
    );
}