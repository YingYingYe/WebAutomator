const express = require('express');
const router = express.Router();

const DBPedia = require('../lib/dbpedia');
const WikiPedia = require('../lib/wikipedia');
const WikiMedia = require('../lib/wikimedia');
const Geonames = require('../lib/geonames');

const CRIDB = require('../lib/cri/db');

// WikiMedia
router.get('/wikimedia/getimageurl/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiMedia.getImageURL(keyword);
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});

// WikiPedia
router.get('/wikipedia/getimagefilenames/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getImageFileNames(keyword);
        // const result = [
        //     "Odo_bayeux_tapestry.png",
        //     "Odo_of_Bayeux.jpg",
        //     "MontfauconHaroldEye.jpg",
        // ]
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});

router.get('/wikipedia/getperson/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getPerson(keyword);
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});
router.get('/wikipedia/search/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getEventDate(keyword);
        return res.json({
            result
        });
    } catch (error) {
        next(error);        
    }
});
router.get('/wikipedia/getcoord/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getWikiCoord(keyword);
        return res.json({
            result
        });
    } catch (error) {
        next(error);        
    }
});

// DBPedia
router.get('/dbpedia/search/:keyword', async (req, res, next) => {
    try {
        const {keyword} = req.params;
        const result = await DBPedia.get(keyword);
        return res.json({
            ...result.data
        });
    } catch (error) {
        next(error);        
    }
})

// Geonames
router.get('/geonames/getcoordinate/:keyword', async (req, res, next) => {
    try {
        const {keyword} = req.params;
        const result = await Geonames.getHierarchy(keyword);
        return res.json({
            ...result.data
        });
    } catch (error) {
        next(error);        
    }
})

// CRIDB
// Save Thing
// Create
router.post('/cridb/save/create/thing', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/create/event', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("event", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/create/medium', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("medium", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

// Merge
router.post('/cridb/save/merge/thing', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/merge/event', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/merge/medium', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.save("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

// Overwrite
router.post('/cridb/save/overwrite/thing', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.overwrite("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/overwrite/event', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.overwrite("event", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/save/overwrite/medium', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.overwrite("medium", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

// Search
router.post('/cridb/search/thing', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.search("thing", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/search/event', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.search("event", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/search/medium', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.search("medium", data);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

// Get Tag IDs
router.post('/cridb/tags/thing', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.getThingTags(data.id);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/tags/event', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.getEventTags(data.id);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})
router.post('/cridb/tags/medium', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.getMediumTags(data.id);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

router.post('/cridb/getdatabyid', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.get(data.recordtype, data.id);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

router.post('/cridb/deletedatabyid', async (req, res, next) => {
    try {
        const data = req.body;
        const db = await CRIDB.createConnection();
        const records = await db.delete(data.recordtype, data.id);
        return res.json({
            records
        });
    } catch (error) {
        next(error);     
    }
})

module.exports = router;