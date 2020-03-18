const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('I should probably say something nice here')
});

module.exports = router;