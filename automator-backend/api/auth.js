const express = require('express');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  const data = req.body;
  if(data.username === "admin" && data.password === "admin"){
    res.send({
      result: "success",
      token: 'token_session_automator2021'
    });
  }else{
    res.send({
      result: "error"
    });
  }
})

module.exports = router;