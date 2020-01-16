const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('FUCK YOU YOU PIECE OF SHIT!')
});

module.exports = router;