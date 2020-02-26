'use strict'

const { Router } = require('express')
const router = Router()

//controller
const { getTrack, uploadTrack } = require('../controllers/tracks.controller')


router.get('/tracks/:trackId', getTrack)

router.post('/tracks', uploadTrack)

module.exports = router
