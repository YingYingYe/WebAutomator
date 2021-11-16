import React, { useState } from 'react';
import { 
    TextField,
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Grid,
    Button,
} from '@material-ui/core';
import * as ApiCRIDB from "../../api/cridb";
import * as ApiFunction from "../../api/function";

import moment from 'moment';

import Person from "../../components/Person"
import Place from "../../components/Place"
import Artefact from "../../components/Artefact"

import { useDispatch } from "react-redux";
import { setListItem } from "../../store/reducers/listitem";

const FormElementProps = {
    fullWidth: true,
    variant: "standard",
    size: "medium",
    className: "mb-4"
}

const Home = () => {
    const dispatch = useDispatch();
    dispatch(setListItem(0));

    const [keyword, setKeyword] = useState("Etna, California");
    const [recordType, setRecordType] = useState("place");
    const [saveAction, setSaveAction] = useState("create");
    const [error, setError] = useState(false);
    const [personLoading, setPersonLoading] = useState(false);
    const [placeLoading, setPlaceLoading] = useState(false);
    const [artefactLoading, setArtefactLoading] = useState(false);

    const dateFormat = (str_date = "", str_format = "") => {
        const date = moment(str_date);
        return date.format(str_format);
    }

    const [person, setPerson] = useState({
        birthDate: "",
        deathDate: "",
        birthPlace: "",
        deathPlace: "",
        article: "",
        downloadableImageURL: "",
    });
    const [place, setPlace] = useState({
        latitude: "",
        longitude: "",
        article: "",
        downloadableImageURL: "",
    });
    const [artefact, setArtefact] = useState({
        startDate: "",
        endDate: "",
        article: "",
        downloadableImageURL: "",
    });

    
    const getPersonForm = async (e) => {
        const res = await ApiCRIDB.getDbPediaByKeyword(ApiFunction.keywordFormat(keyword));       
        if (res.inValid) {
            setError(true); 
            return;
        }
        const {
            birthDate,
            deathDate,
            comment,
        } = res.data;

        let article = "";
        try{
            comment.forEach(element => {
                if (element.lang === "en" && article === ""){
                    article = element.value;
                }      
            })
        }catch(ex){}
        
        let birth;
        try{birth = dateFormat(birthDate[0].value, "MM/DD/yyyy")}catch(e){birth = ""}
        let death;
        try{death = dateFormat(deathDate[0].value, "MM/DD/yyyy")}catch(e){death = ""}
        
        let wikiDom = await ApiCRIDB.getPerson(ApiFunction.keywordFormat(keyword));
        
        let bPlace;
        try{bPlace = wikiDom.data.result.birthPlace}catch(e){bPlace = ""}
        let dPlace;
        try{dPlace = wikiDom.data.result.deathPlace}catch(e){dPlace = ""}

        let imageURL = "";
        try{
            const imageList = (await ApiCRIDB.getImageFileNames(keyword)).data.result;
            let promiseArr = [];
            imageList.forEach(image => {
                promiseArr.push(ApiCRIDB.getDownloadableImageURL(image));
            })
            const results = await Promise.all(promiseArr);
            results.forEach(ele => {
                const imageName = ele.data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        setPerson({
            birthDate: birth,
            deathDate: death,
            birthPlace: bPlace,
            deathPlace: dPlace,
            article: article,
            downloadableImageURL: imageURL
        });
    }
    const getPlaceForm = async (e) => {
        const res = await ApiCRIDB.getDbPediaByKeyword(ApiFunction.keywordFormat(keyword));       
        if (res.inValid) {
            setError(true); 
            return;
        }

        const {
            comment,
        } = res.data;
        
        let article = "";
        comment.forEach(element => {
            if (element.lang === "en" && article === ""){
                article = element.value;
            }      
        })

        let {lat, lon} = (await ApiCRIDB.getWikiCoord(ApiFunction.keywordFormat(keyword))).data.result;

        let imageURL = "";
        try{
            const imageList = (await ApiCRIDB.getImageFileNames(keyword)).data.result;
            let promiseArr = [];
            imageList.forEach(image => {
                promiseArr.push(ApiCRIDB.getDownloadableImageURL(image));
            })
            const results = await Promise.all(promiseArr);
            results.forEach(ele => {
                const imageName = ele.data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        setPlace({
            latitude: lat,
            longitude: lon,
            article: article,
            downloadableImageURL: imageURL
        });
    }
    const getArtefactForm = async (e) => {
        const res = await ApiCRIDB.getDbPediaByKeyword(keyword);       
        if (res.inValid) {
            setError(true); 
            return;
        }
        const {
            comment,
        } = res.data;
        
        let article = "";
        comment.forEach(element => {
            if (element.lang === "en" && article === ""){
                article = element.value;
            }      
        })

        let imageURL = "";
        try{
            const imageList = (await ApiCRIDB.getImageFileNames(keyword)).data.result;
            let promiseArr = [];
            imageList.forEach(image => {
                promiseArr.push(ApiCRIDB.getDownloadableImageURL(image));
            })
            const results = await Promise.all(promiseArr);
            results.forEach(ele => {
                const imageName = ele.data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        setArtefact({
            startDate: "",
            endDate: "",
            article: article,
            downloadableImageURL: imageURL
        });
    }
    
    
    const setPersonForm = (key, value) => {
        setPerson({
            ...person,
            [key]: value
        });
    }
    const setPlaceForm = (key, value) => {
        setPlace({
            ...place,
            [key]: value
        });
    }
    const setArtefactForm = (key, value) => {
        setArtefact({
            ...artefact,
            [key]: value
        });
    }

    const saveForm = async (cridbId) => {
        if(saveAction === "create"){
            if(recordType === "person"){
                setPersonLoading(true);
                const record = {
                    keyword: keyword,
                    birthdate: person.birthDate,
                    birthplace: person.birthplace,
                    deathdate: person.deathDate,
                    deathplace: person.deathplace,
                    article: person.article,
                    pictures: person.downloadableImageURL
                };
                try{
                    await ApiFunction.createPersonAction(record);
                    setPersonLoading(false);
                }catch(error){}
            }else if(recordType === "place"){
                setPlaceLoading(true);
                const record = {
                    keyword: keyword,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    article: place.article,
                    pictures: place.downloadableImageURL
                }
                try{
                    await ApiFunction.createPlaceAction(record);
                }catch(error){}
                setPlaceLoading(false);
            }else if(recordType === "artefact"){
                setArtefactLoading(true);
                const record = {
                    keyword: keyword,
                    startdate: artefact.startDate,
                    enddate: artefact.endDate,
                    article: artefact.article,
                    pictures: artefact.downloadableImageURL
                }
                try{
                    await ApiFunction.createArtefactAction(record);
                }catch(error){}
                setArtefactLoading(false);
            }
        }else if(saveAction === "overwrite"){
            if(recordType === "person"){
                setPersonLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    birthdate: person.birthDate,
                    birthplace: person.birthplace,
                    deathdate: person.deathDate,
                    deathplace: person.deathplace,
                    article: person.article,
                    pictures: person.downloadableImageURL
                }
                try{
                    await ApiFunction.overwritePersonAction(record);
                    setPersonLoading(false);
                }catch(error){}
            }else if(recordType === "place"){   
                setPlaceLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    article: place.article,
                    pictures: place.downloadableImageURL
                }
                try{
                    await ApiFunction.overwritePlaceAction(record);
                }catch(error){}
                setPlaceLoading(false);
            }else if(recordType === "artefact"){
                setArtefactLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    startdate: artefact.startDate,
                    enddate: artefact.endDate,
                    article: artefact.article,
                    pictures: artefact.pictures
                }   
                try{
                    await ApiFunction.overwriteArtefactAction(record);
                }catch(error){}
                setArtefactLoading(false);
            }    
        }else if(saveAction === "merge"){
            if(recordType === "person"){
                setPersonLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    birthdate: person.birthDate,
                    birthplace: person.birthplace,
                    deathdate: person.deathDate,
                    deathplace: person.deathplace,
                    article: person.article,
                    pictures: person.downloadableImageURL
                }
                try{
                    await ApiFunction.mergePersonAction(record);
                    setPersonLoading(false);
                }catch(error){}
            }else if(recordType === "place"){   
                setPlaceLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    article: place.article,
                    pictures: place.downloadableImageURL
                }
                try{
                    await ApiFunction.mergePlaceAction(record);
                }catch(error){}
                setPlaceLoading(false);
            }else if(recordType === "artefact"){
                setArtefactLoading(true);
                const record = {
                    keyword: keyword,
                    cridbid: cridbId,
                    startdate: artefact.startDate,
                    enddate: artefact.endDate,
                    article: artefact.article,
                    pictures: artefact.pictures
                }   
                try{
                    await ApiFunction.mergeArtefactAction(record);
                }catch(error){}
                setArtefactLoading(false);
            }
        }
    }

    let resultForm;
    if(recordType === "person"){
        resultForm = <Person
                        func={{saveForm, setSaveAction, setPersonForm}}
                        data={{keyword, person, saveAction, personLoading}}
                        FormElementProps={FormElementProps}
                    />;
    }else if(recordType === "place"){
        resultForm = <Place
                        func={{saveForm, setSaveAction, setPlaceForm}}
                        data={{keyword, place, saveAction, placeLoading}}
                        FormElementProps={FormElementProps}
                    />;
    }else if(recordType === "artefact"){
        resultForm = <Artefact
                        func={{saveForm, setSaveAction, setArtefactForm}}
                        data={{keyword, artefact, saveAction, artefactLoading}}
                        FormElementProps={FormElementProps}
                    />;
    }

    const goSubmit = e => {
        try{
            if(recordType === "person"){
                getPersonForm();
            }else if(recordType === "place"){
                getPlaceForm();
            }else if(recordType === "artefact"){
                getArtefactForm();
            }
        }catch(ex){
            setError(true); 
            return;
        }
    }

    return (
    <>
        <Grid container className="px-1 py-3" spacing={5}>
            <Grid item xs={1} md={1}></Grid>
            <Grid item xs={5} md={3} className="pr-3">
                <Typography variant="h6" className="mb-8 pb-3" align="left">Search</Typography>
                <form onSubmit={goSubmit} className="mb-4">
                    <TextField 
                        fullWidth
                        className="mb-2"
                        variant="standard"
                        value={keyword}
                        onChange={e => {
                            if (error) setError(false);
                            setKeyword(e.target.value);
                        }}
                        
                        label="Wikipedia name"
                        error={error}
                        helperText={error ? "Can not find data." : ""}
                    />
                </form>
                <FormControl {...FormElementProps}>
                    <InputLabel id="recordType">Record type</InputLabel>
                    <Select 
                        label="Record type"
                        value={recordType}
                        onChange={e => {setSaveAction("create"); setRecordType(e.target.value);}}
                    >
                        <MenuItem value="person">Person</MenuItem>
                        <MenuItem value="place">Place</MenuItem>
                        <MenuItem value="artefact">Artefact</MenuItem>
                    </Select>
                </FormControl>
                <Grid container align="right">
                    <Grid item xs={12} md={12}>
                        <Button variant="outlined" color="primary" size="large" onClick={goSubmit}>
                            Go
                        </Button>
                    </Grid>
                </Grid> 
            </Grid>
            <Grid item xs={5} md={7}>
                {resultForm}
            </Grid>
            <Grid item xs={1} md={1}></Grid>
        </Grid>
    </>
    );
}

export default Home;