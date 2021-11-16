import * as ApiCRIDB from "./cridb";

// Person Save Action
export const createPersonAction = async(record) => {
    // Person : Thing
    const personQuery = 
    {
        "command": "save",
        "record_type": "thing",
        "data": {
            "subtype": "person",
            "name"   : keynameFormat(record.keyword),
            "status" : "online",
        }
    }
    await ApiCRIDB.saveCreateThing(personQuery);

    const {data} = await ApiCRIDB.searchThing({query: keynameFormat(record.keyword)});

    // Record ID
    const recordID = data.records[data.records.length - 1].id;

    const articleQuery = 
    { 
        "command": "save",
        "record_type": "medium",
        "data": { 
            "subtype" : "article",
            "name" : keynameFormat(record.keyword),
            "content": record.article,
            "status" : "online",
            "tags"    : [ {"id":recordID,"type":"thing"} ]
        }
    }

    // BirthPlace and BirthDate
    const place_birth = 
    { 
        "command": "save",
        "record_type": "thing",
        "data": { 
            "subtype" : "place",
            "name" : record.birthplace,
            "status" : "online",
        }
    }

    await ApiCRIDB.saveCreateThing(place_birth);

    const birthPlaceId = (await ApiCRIDB.searchThing({query: record.birthplace})).data.records[0].id;
    const event_birth = 
    { 
        "command": "save",
        "record_type": "event",
        "data": { 
            "subtype" : "birth",
            "date"    : record.birthdate,
            "status" : "online",
            "tags"    : [{"id":recordID,"type":"thing"}, {"id":birthPlaceId, "type":"thing"}]
        }
    }
    await ApiCRIDB.saveCreateEvent(event_birth);

    // DeathPlace and DeathDate
    const place_death = 
    { 
        "command": "save",
        "record_type": "thing",
        "data": { 
            "subtype" : "place",
            "name" : record.deathplace,
            "status" : "online",
        }
    }
    await ApiCRIDB.saveCreateThing(place_death);

    const deathPlaceId = (await ApiCRIDB.searchThing({query: record.deathplace})).data.records[0].id;
    const event_death = 
    { 
        "command": "save",
        "record_type": "event",
        "data": { 
            "subtype" : "death",    
            "date"    : record.deathdate,
            "status" : "online",
            "tags"    : [ {"id":recordID, "type":"thing"}, {"id":deathPlaceId, "type":"thing"} ]
        }
    }
        
    await ApiCRIDB.saveCreateEvent(event_death);

    // Article
    await ApiCRIDB.saveCreateMedium(articleQuery);
            
    const downloadURLs = record.pictures.trim().split("\n");
    // Pictures
    let uploadPromises = [];
    for( let i = 0; i < downloadURLs.length; i++ ){
        const ext = (/[^.]+$/.exec(downloadURLs[i]))[0];
        const imageName = downloadURLs[i].split("." + ext)[0];
        const nameArr = imageName.split("/");
        const name = nameArr[nameArr.length-1];
        const picture = 
        { 
            "command": "save",
            "record_type": "medium",
            "url": downloadURLs[i],
            "data": { 
                "status": "online",
                "subtype" : "picture",
                "name" : name,
                "nickname": imageName,
                "ext"     : ext,
                "tags"    : [ {"id":recordID, "type":"thing"} ]
            }
        }
        uploadPromises.push(ApiCRIDB.saveCreateMedium(picture));
    }
    await Promise.all(uploadPromises);
}

export const overwritePersonAction = async(record) => {
    console.log("overwrite action started!", record);
    let thingId = record.cridbid;
    const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;
    let birthPlace = "";
    let deathPlace = "";
    let birthPlaceId = "";
    let deathPlaceId = "";
    let birthId = "";
    let deathId = "";
    let pictures = [];
    let articles = [];

    let subDataApi = [];
    thingTags.forEach(item => {
        subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
    });
    await Promise.all(subDataApi).then(async(res)=>{
        res.forEach(element => {
            const subData = element.data.records;
            if(subData.subtype === "birth"){
                birthId = subData.id;
            }
            if(subData.subtype === "death"){
                deathId = subData.id;
            }
            if(subData.subtype === "picture"){
                pictures.push({id: subData.id, data: subData.nickname});
            }
            if(subData.subtype === "article"){
                articles.push({id: subData.id, data: subData.content});
            }
        })

        try{
            if(birthId !== ""){
                birthPlaceId = (await ApiCRIDB.getDataById({ recordtype: "event", id: birthId })).data.records.tags[1].id;
                birthPlace = (await ApiCRIDB.getDataById({ recordtype: "thing", id: birthPlaceId })).data.records.name;
            }
            if(deathId !== ""){
                deathPlaceId = (await ApiCRIDB.getDataById({ recordtype: "event", id: deathId })).data.records.tags[1].id;
                deathPlace = (await ApiCRIDB.getDataById({ recordtype: "thing", id: deathPlaceId })).data.records.name;
            }
        }catch(error){}

        // Overwrite Action
        // birthplace
        if(birthPlace !== record.birthplace){
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "id"         : birthPlaceId,
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.birthplace 
                }
            }
            await ApiCRIDB.saveOverwriteThing(query);
        }

        // deathplace
        if(deathPlace !== record.deathplace){
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "id"         : deathPlaceId,
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.deathplace 
                }
            }
            await ApiCRIDB.saveOverwriteThing(query);
        }

        // article
        if(articles[0].data !== record.article){
            const query = { 
                "command"    : "save",
                "record_type": "medium",
                "id"         : articles[0].id,
                "data": {
                    "subtype" : "article",
                    "name": keynameFormat(record.keyword),
                    "status": "online",
                    "content": record.article
                }
            }
            await ApiCRIDB.saveOverwriteMedium(query);
        }
        
        // picture
        let picArr = record.pictures.trim().split("\n");
        let copiedPicArr = [...picArr];
        let copiedPictures = [...pictures];
        for (let i = 0; i < picArr.length; i++) {
            if(picArr[i] !== ""){
                for (let j = 0; j < pictures.length; j++) {
                    const pic = pictures[j];
                    const ext = /[^.]+$/.exec(picArr[i])[0];
                    const imageName = (picArr[i].split("." + ext))[0];
                    if (pic.data.indexOf(imageName) >= 0) {
                        copiedPicArr[i] = undefined;
                        copiedPictures[j] = undefined;
                    }
                }
            }else{
                copiedPicArr[i] = undefined;
            }
        }

        let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
        let deleteIdArr = [...copiedPictures.filter(ele=>ele !== undefined)];

        var mergeEvent = [];
        var deleteIdsEvent = [];
        mergeArr.forEach(ele => {
            let ext = "";
                try{
                    ext = (/[^.]+$/.exec(ele))[0];
                }catch(ex){}
            const imageName = (ele.split("." + ext))[0];
            const query = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": ele,
                "data": { 
                    "subtype" : "picture",
                    "name" : keynameFormat(record.keyword),
                    "nickname": imageName,
                    "ext"     : ext,
                    "status": "online",
                    "tags"    : [ {"id":thingId,"type":"thing"} ]
                }
            }
            mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
        })
        await Promise.all(mergeEvent);

        deleteIdArr.forEach(ele => {
            deleteIdsEvent.push(ApiCRIDB.deleteDataById({ recordtype: "medium", id: ele.id }));
        })
        await Promise.all(deleteIdsEvent);
    });
}

export const mergePersonAction = async(record) => {
    console.log("merge action started!", record);
    let thingId = record.cridbid;
    const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;
    
    let birthPlaceId = "";
    let deathPlaceId = "";
    let birthPlace = "";
    let deathPlace = "";
    let birthId = "";
    let deathId = "";
    let pictures = [];
    let articles = [];

    let subDataApi = [];
    thingTags.forEach(item => {
        subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
    });
    await Promise.all(subDataApi).then(async(res)=>{
        res.forEach(element => {
            const subData = element.data.records;
            if(subData.subtype === "birth"){
                birthId = subData.id;
            }
            if(subData.subtype === "death"){
                deathId = subData.id;
            }
            if(subData.subtype === "picture"){
                pictures.push({id: subData.id, data: subData.nickname});
            }
            if(subData.subtype === "article"){
                articles.push({id: subData.id, data: subData.content});
            }
        })

        try{
            if(birthId !== ""){
                birthPlaceId = (await ApiCRIDB.getDataById({ recordtype: "event", id: birthId })).data.records.tags[1].id;
                birthPlace = (await ApiCRIDB.getDataById({ recordtype: "thing", id: birthPlaceId })).data.records.name;
            }
            if(deathId !== ""){
                deathPlaceId = (await ApiCRIDB.getDataById({ recordtype: "event", id: deathId })).data.records.tags[1].id;
                deathPlace = (await ApiCRIDB.getDataById({ recordtype: "thing", id: deathPlaceId })).data.records.name;
            }
        }catch(error){}
        
        // Overwrite Action
        // birthplace
        console.log("cridb birthPlace =>", birthPlace);
        console.log("record birthplace =>", record.birthplace);
        if(birthPlace !== record.birthplace){
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "id"         : birthPlaceId,
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.birthplace 
                }
            }
            await ApiCRIDB.saveOverwriteThing(query);
        }else{
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.birthplace 
                }
            }
            await ApiCRIDB.saveCreateThing(query);                            
        }

        // deathplace
        if(deathPlace !== record.deathplace){
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "id"         : deathPlaceId,
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.deathplace 
                }
            }
            await ApiCRIDB.saveOverwriteThing(query);
        }else{
            const query = { 
                "command"    : "save",
                "record_type": "thing",
                "data": {
                    "subtype" : "place",
                    "status": "online",
                    "name": record.deathplace 
                }
            }
            await ApiCRIDB.saveCreateThing(query);
        }
        
        // article
        if(articles.length > 0){
            if(articles[0].data !== record.article){
                const query = { 
                    "command"    : "save",
                    "record_type": "medium",
                    "id"         : articles[0].id,
                    "data": {
                        "subtype" : "article",
                        "name": keynameFormat(record.keyword),
                        "status": "online",
                        "content": record.article
                    }
                }
                await ApiCRIDB.saveOverwriteMedium(query);
            }
        }else{
            const query = { 
                "command"    : "save",
                "record_type": "medium",
                "data": {
                    "subtype" : "article",
                    "name": keynameFormat(record.keyword),
                    "status": "online",
                    "content": record.article
                }
            }
            await ApiCRIDB.saveCreateMedium(query);
        }
        
        // picture
        let picArr = record.pictures.trim().split("\n");
        let copiedPicArr = [...picArr];
        for (let i = 0; i < picArr.length; i++) {
            if(picArr[i] !== ""){
                for (let j = 0; j < pictures.length; j++) {
                    const pic = pictures[j];
                    const ext = /[^.]+$/.exec(picArr[i])[0];
                    const imageName = (picArr[i].split("." + ext))[0];
                    if (pic.data.indexOf(imageName) >= 0) {
                        copiedPicArr[i] = undefined;
                    }
                }
            }else{
                copiedPicArr[i] = undefined;
            }
        }

        let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
        var mergeEvent = [];
        mergeArr.forEach(ele => {
            let ext = "";
                try{
                    ext = (/[^.]+$/.exec(ele))[0];
                }catch(ex){}
            const imageName = (ele.split("." + ext))[0];
            const nameArr = imageName.split("/");
            const name = nameArr[nameArr.length-1];
            const query = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": ele,
                "data": { 
                    "subtype" : "picture",
                    "name" : name,
                    "nickname": imageName,
                    "ext"     : ext,
                    "status": "online",
                    "tags"    : [ {"id":thingId,"type":"thing"} ]
                }
            }
            mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
        })
        await Promise.all(mergeEvent);                        
    });
}

// Place Save Action
export const createPlaceAction = async(record) => {
    console.log(keynameFormat(record.keyword));
    // Place : Thing
    const query = 
    {
        "command": "save",
        "record_type": "thing",
        "data": {
            "subtype": "place",
            "name"   : keynameFormat(record.keyword),
            "lat" : record.latitude,
            "long" : record.longitude,
            "status" : "online",
        }
    }
    await ApiCRIDB.saveCreateThing(query);

    const {data} = await ApiCRIDB.searchThing({query: keynameFormat(record.keyword)});

    // Record ID
    const recordID = data.records[data.records.length - 1].id;
    
    // Article
    const articleQuery = 
    { 
        "command": "save",
        "record_type": "medium",
        "data": { 
            "subtype" : "article",
            "name" : keynameFormat(record.keyword),
            "content": record.article,
            "status" : "online",
            "tags"    : [ {"id":recordID, "type":"thing"} ]
        }
    }
    await ApiCRIDB.saveCreateMedium(articleQuery);
    
    // Pictures
    let uploadPromises = [];
    const downloadURLs = record.pictures.trim().split("\n");
    for( let i = 0; i < downloadURLs.length; i++ ){
        const ext = (/[^.]+$/.exec(downloadURLs[i]))[0];
        const imageName = downloadURLs[i].split("." + ext)[0];
        const nameArr = imageName.split("/");
        const name = nameArr[nameArr.length-1];
        const picture = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": downloadURLs[i],
                "data": { 
                    "status": "online",
                    "subtype" : "picture",
                    "name" : name,
                    "nickname": imageName,
                    "ext"     : ext,
                    "tags"    : [ {"id":recordID, "type":"thing"} ]
                }
            }
        uploadPromises.push(ApiCRIDB.saveCreateMedium(picture));
    }
    await Promise.all(uploadPromises);
}

export const overwritePlaceAction = async(record) => {
    let thingId = record.cridbid;
    const apiData = (await ApiCRIDB.getDataById({ recordtype: "thing", id: thingId })).data.records;
    const query = {
        "command": "save",
        "record_type": "thing",
        "id"         : apiData.id,
        "data": {
            "subtype": "place",
            "name"   : keynameFormat(record.keyword),
            "lat" : record.latitude,
            "long" : record.longitude,
            "status" : "online",
        }
    }
    await ApiCRIDB.saveOverwriteThing(query);

    if(thingId !== ""){
        const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;

        let pictures = [];
        let articles = [];

        let subDataApi = [];
        thingTags.forEach(item => {
            subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
        });
        await Promise.all(subDataApi).then(async(res)=>{
            res.forEach(element => {
                const subData = element.data.records;
                if(subData.subtype === "picture"){
                    pictures.push({id: subData.id, data: subData.nickname});
                }
                if(subData.subtype === "article"){
                    articles.push({id: subData.id, data: subData.content});
                }
            })

            // Overwrite Action
            
            // article
            if(articles[0].data !== record.article){
                const query = { 
                    "command"    : "save",
                    "record_type": "medium",
                    "id"         : articles[0].id,
                    "data": {
                        "subtype" : "article",
                        "name": keynameFormat(record.keyword),
                        "status": "online",
                        "content": record.article
                    }
                }
                await ApiCRIDB.saveOverwriteMedium(query);
            }
            
            let picArr = record.pictures.trim().split("\n");
            
            // picture
            
            let copiedPicArr = [...picArr];
            let copiedPictures = [...pictures];
            for (let i = 0; i < picArr.length; i++) {
                if(picArr[i] !== ""){
                    for (let j = 0; j < pictures.length; j++) {
                        const pic = pictures[j];
                        const ext = /[^.]+$/.exec(picArr[i])[0];
                        const imageName = (picArr[i].split("." + ext))[0];
                        if (pic.data.indexOf(imageName) >= 0) {
                            copiedPicArr[i] = undefined;
                            copiedPictures[j] = undefined;
                        }
                    }
                }else{
                    copiedPicArr[i] = undefined;
                }
            }

            let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
            let deleteIdArr = [...copiedPictures.filter(ele=>ele !== undefined)];
            var mergeEvent = [];
            var deleteIdsEvent = [];
            mergeArr.forEach(ele => {
                let ext = "";
                try{
                    ext = (/[^.]+$/.exec(ele))[0];
                }catch(ex){}
                const imageName = (ele.split("." + ext))[0];
                const nameArr = imageName.split("/");
                const name = nameArr[nameArr.length-1];
                const query = 
                { 
                    "command": "save",
                    "record_type": "medium",
                    "url": ele,
                    "data": { 
                        "subtype" : "picture",
                        "name" : name,
                        "nickname": imageName,
                        "ext"     : ext,
                        "status": "online",
                        "tags"    : [ {"id":thingId,"type":"thing"} ]
                    }
                }
                mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
            })
            await Promise.all(mergeEvent);

            deleteIdArr.forEach(ele => {
                deleteIdsEvent.push(ApiCRIDB.deleteDataById({ recordtype: "medium", id: ele.id }));
            })
            await Promise.all(deleteIdsEvent);                     
        });
    }
}

export const mergePlaceAction = async(record) => {
    let thingId = record.cridbid;

    try{
        const apiData = (await ApiCRIDB.getDataById({ recordtype: "thing", id: thingId })).data.records;
        const query = {
            "command": "save",
            "record_type": "thing",
            "id"         : apiData.id,
            "data": {
                "subtype": "place",
                "name"   : keynameFormat(record.keyword),
                "lat" : record.latitude,
                "long" : record.longitude,
                "status" : "online",
            }
        }
        await ApiCRIDB.saveOverwriteThing(query);
    }catch(ex){
        const query = {
            "command": "save",
            "record_type": "thing",
            "data": {
                "subtype": "place",
                "name"   : keynameFormat(record.keyword),
                "lat" : record.latitude,
                "long" : record.longitude,
                "status" : "online",
            }
        }
        await ApiCRIDB.saveCreateThing(query);
    }

    if(thingId !== ""){
        const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;

        let pictures = [];
        let articles = [];

        let subDataApi = [];
        thingTags.forEach(item => {
            subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
        });
        await Promise.all(subDataApi).then(async(res)=>{

            res.forEach(element => {
                const subData = element.data.records;
                if(subData.subtype === "picture"){
                    pictures.push({id: subData.id, data: subData.nickname});
                }
                if(subData.subtype === "article"){
                    articles.push({id: subData.id, data: subData.content});
                }
            })

            // Overwrite Action
            
            // article
            if(articles.length > 0){
                if(articles[0].data !== record.article){
                    const query = { 
                        "command"    : "save",
                        "record_type": "medium",
                        "id"         : articles[0].id,
                        "data": {
                            "subtype" : "article",
                            "name": keynameFormat(record.keyword),
                            "status": "online",
                            "content": record.article
                        }
                    }
                    await ApiCRIDB.saveOverwriteMedium(query);
                }
            }else{
                const query = { 
                    "command"    : "save",
                    "record_type": "medium",
                    "data": {
                        "subtype" : "article",
                        "name": keynameFormat(record.keyword),
                        "status": "online",
                        "content": record.article
                    }
                }
                await ApiCRIDB.saveCreateMedium(query);
            }
            
            let picArr = record.pictures.trim().split("\n");
            
            // picture
            
            let copiedPicArr = [...picArr];
            let copiedPictures = [...pictures];
            for (let i = 0; i < picArr.length; i++) {
                if(picArr[i] !== ""){
                    for (let j = 0; j < pictures.length; j++) {
                        const pic = pictures[j];
                        const ext = /[^.]+$/.exec(picArr[i])[0];
                        const imageName = (picArr[i].split("." + ext))[0];
                        if (pic.data.indexOf(imageName) >= 0) {
                            copiedPicArr[i] = undefined;
                            copiedPictures[j] = undefined;
                        }
                    }
                }else{
                    copiedPicArr[i] = undefined;
                }
            }

            let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
            var mergeEvent = [];
            mergeArr.forEach(ele => {
                let ext = "";
                    try{
                      ext = (/[^.]+$/.exec(ele))[0];
                    }catch(ex){}
                const imageName = (ele.split("." + ext))[0];
                const nameArr = imageName.split("/");
                const name = nameArr[nameArr.length-1];
                const query = 
                { 
                    "command": "save",
                    "record_type": "medium",
                    "url": ele,
                    "data": { 
                        "subtype" : "picture",
                        "name" : name,
                        "nickname": imageName,
                        "ext"     : ext,
                        "status": "online",
                        "tags"    : [ {"id":thingId, "type":"thing"} ]
                    }
                }
                mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
            })
            await Promise.all(mergeEvent);
        });
    }
}

// Artefact Save Action
export const createArtefactAction = async(record) => {
    // Artefact : Thing
    const query = 
    {
        "command": "save",
        "record_type": "thing",
        "data": {
            "subtype": "artefact",
            "name"   : keynameFormat(record.keyword),
            "status" : "online",
        }
    }
    await ApiCRIDB.saveCreateThing(query);

    const {data} = await ApiCRIDB.searchThing({query: keywordFormat(record.keyword)});

    // Record ID
    const recordID = data.records[data.records.length - 1].id;

    const articleQuery = 
    { 
        "command": "save",
        "record_type": "medium",
        "data": { 
            "subtype" : "article",
            "name" : keynameFormat(record.keyword),
            "content": record.article,
            "status" : "online",
            "tags"    : [ {"id":recordID, "type":"thing"} ]
        }
    }

    const downloadURLs = record.pictures.trim().split("\n");
    // StartDate and EndDate
    const date_start = 
        { 
            "command": "save",
            "record_type": "event",
            "data": { 
                "subtype" : "start",
                "date"    : record.startdate,
                "status" : "online",
                "tags"    : [ {"id":recordID, "type":"thing"} ]
            }
        }
    await ApiCRIDB.saveCreateEvent(date_start);
        
    const date_end = 
        { 
            "command": "save",
            "record_type": "event",
            "data": { 
                "subtype" : "end",
                "date"    : record.enddate,
                "status"  : "online",
                "tags"    : [ {"id":recordID, "type":"thing"} ]
            }
        }
        
    await ApiCRIDB.saveCreateEvent(date_end);
    // Article
    await ApiCRIDB.saveCreateMedium(articleQuery);

    // Pictures
    let uploadPromises = [];
    for( let i = 0; i < downloadURLs.length; i++ ){
        const ext = (/[^.]+$/.exec(downloadURLs[i]))[0];
        const imageName = downloadURLs[i].split("." + ext)[0];
        const nameArr = imageName.split("/");
        const name = nameArr[nameArr.length-1];
        const picture = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": downloadURLs[i],
                "data": { 
                    "status": "online",
                    "subtype" : "picture",
                    "name" : name,
                    "nickname": imageName,
                    "ext"     : ext,
                    "tags"    : [ {"id":recordID, "type":"thing"} ]
                }
            }
        uploadPromises.push(ApiCRIDB.saveCreateMedium(picture));
    }
    await Promise.all(uploadPromises);
}

export const overwriteArtefactAction = async(record) => {
    let thingId = record.cridbid;
    const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;

    let pictures = [];
    let articles = [];

    let subDataApi = [];
    thingTags.forEach(item => {
        subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
    });
    await Promise.all(subDataApi).then(async(res)=>{
        res.forEach(element => {
            const subData = element.data.records;
            if(subData.subtype === "picture"){
                pictures.push({id: subData.id, data: subData.nickname});
            }
            if(subData.subtype === "article"){
                articles.push({id: subData.id, data: subData.content});
            }
        })

        // Overwrite Action
        
        // article
        if(articles[0].data !== record.article){
            const query = { 
                "command"    : "save",
                "record_type": "medium",
                "id"         : articles[0].id,
                "data": {
                    "subtype" : "article",
                    "name": keynameFormat(record.keyword),
                    "status": "online",
                    "content": record.article
                }
            }
            await ApiCRIDB.saveOverwriteMedium(query);
        }
        
        let picArr = record.pictures.trim().split("\n");
        
        // picture
        
        let copiedPicArr = [...picArr];
        let copiedPictures = [...pictures];
        for (let i = 0; i < picArr.length; i++) {
            if(picArr[i] !== ""){
                for (let j = 0; j < pictures.length; j++) {
                    const pic = pictures[j];
                    const ext = /[^.]+$/.exec(picArr[i])[0];
                    const imageName = (picArr[i].split("." + ext))[0];
                    if (pic.data.indexOf(imageName) >= 0) {
                        copiedPicArr[i] = undefined;
                        copiedPictures[j] = undefined;
                    }
                }
            }else{
                copiedPicArr[i] = undefined;
            }
        }

        let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
        let deleteIdArr = [...copiedPictures.filter(ele=>ele !== undefined)];
        var mergeEvent = [];
        var deleteIdsEvent = [];
        mergeArr.forEach(ele => {
            let ext = "";
                try{
                    ext = (/[^.]+$/.exec(ele))[0];
                }catch(ex){}
            const imageName = (ele.split("." + ext))[0];
            const nameArr = imageName.split("/");
            const name = nameArr[nameArr.length-1];
            const query = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": ele,
                "data": { 
                    "subtype" : "picture",
                    "name" : name,
                    "nickname": imageName,
                    "ext"     : ext,
                    "status": "online",
                    "tags"    : [ {"id":thingId, "type":"thing"} ]
                }
            }
            mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
        })
        await Promise.all(mergeEvent);

        deleteIdArr.forEach(ele => {
            deleteIdsEvent.push(ApiCRIDB.deleteDataById({ recordtype: "medium", id: ele.id }));
        })
        await Promise.all(deleteIdsEvent);                     
    });
}

export const mergeArtefactAction = async(record) => {
    
    let thingId = record.cridbid;
    const thingTags = (await ApiCRIDB.getTagsThing({id: thingId})).data.records;

    let pictures = [];
    let articles = [];

    let subDataApi = [];
    thingTags.forEach(item => {
        subDataApi.push(ApiCRIDB.getDataById({ recordtype: item.type, id: item.id }))
    });
    await Promise.all(subDataApi).then(async(res)=>{

        res.forEach(element => {
            const subData = element.data.records;
            if(subData.subtype === "picture"){
                pictures.push({id: subData.id, data: subData.nickname});
            }
            if(subData.subtype === "article"){
                articles.push({id: subData.id, data: subData.content});
            }
        })

        // Overwrite Action
        
        // article
        if(articles.length > 0){
            if(articles[0].data !== record.article){
                const query = { 
                    "command"    : "save",
                    "record_type": "medium",
                    "id"         : articles[0].id,
                    "data": {
                        "subtype" : "article",
                        "name": keynameFormat(record.keyword),
                        "status": "online",
                        "content": record.article
                    }
                }
                await ApiCRIDB.saveOverwriteMedium(query);
            }
        }else{
            const query = { 
                "command"    : "save",
                "record_type": "medium",
                "data": {
                    "subtype" : "article",
                    "name": keynameFormat(record.keyword),
                    "status": "online",
                    "content": record.article
                }
            }
            await ApiCRIDB.saveCreateMedium(query);
        }
        
        let picArr = record.pictures.trim().split("\n");
        
        // picture
        
        let copiedPicArr = [...picArr];
        let copiedPictures = [...pictures];
        for (let i = 0; i < picArr.length; i++) {
            if(picArr[i] !== ""){
                for (let j = 0; j < pictures.length; j++) {
                    const pic = pictures[j];
                    const ext = /[^.]+$/.exec(picArr[i])[0];
                    const imageName = (picArr[i].split("." + ext))[0];
                    if (pic.data.indexOf(imageName) >= 0) {
                        copiedPicArr[i] = undefined;
                        copiedPictures[j] = undefined;
                    }
                }
            }else{
                copiedPicArr[i] = undefined;
            }
        }

        let mergeArr = [...copiedPicArr.filter(ele=>ele !== undefined)];
        var mergeEvent = [];
        mergeArr.forEach(ele => {
            let ext = "";
                try{
                    ext = (/[^.]+$/.exec(ele))[0];
                }catch(ex){}
            const imageName = (ele.split("." + ext))[0];
            const nameArr = imageName.split("/");
            const name = nameArr[nameArr.length-1];
            const query = 
            { 
                "command": "save",
                "record_type": "medium",
                "url": ele,
                "data": { 
                    "subtype" : "picture",
                    "name" : name,
                    "nickname": imageName,
                    "ext"     : ext,
                    "status": "online",
                    "tags"    : [ {"id":thingId, "type":"thing"} ]
                }
            }
            mergeEvent.push(ApiCRIDB.saveCreateMedium(query));
        })
        await Promise.all(mergeEvent);
    });
}


export const keywordFormat = (keyword) => {
    const keyname = keyword.replace(/\s\s+/g, ' ').trim().replaceAll(' ', '_');
    return keyname;
}

export const keynameFormat = (keyword) => {
    const keyname = keywordFormat(keyword).replaceAll('_', ' ');
    return keyname;
}