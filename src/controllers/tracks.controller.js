'use strict'

const multer = require('multer')
const { getConnection } = require('../database/database')
const { GridFSBucket } = require('mongodb')
const { Readable } = require('stream')

const getTrack = (req, res) => {

    let trackId;
    try {
      trackId = new ObjectID(req.params.trackId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid track in URL parameter.' });
    }
  
    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");
  
    const db = getConnection();
    let bucket = new GridFSBucket(db, {
      bucketName: 'tracks'
    });
  
    let downloadStream = bucket.openDownloadStream(trackId);
  
    downloadStream.on('data', chunk => {
      res.write(chunk);
    });
  
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
  
    downloadStream.on('end', () => {
      res.end();
    });
  }
  

const uploadTrack = (req, res) => {
   const storage = multer.memoryStorage()
   const upload = multer({
    storage,
    limits: {
      filds: 1,
      fileSize: 10000000,
      files: 1,
      parts: 2
    }
   })
   upload.single('track')(req,res,(err) => {
    if(err) {
      console.log(err)
      return res.status(400).json({message: err.message})
    } else if(!req.body.name) {
        return res.status(400).json({message: 'No track name in request body'})
    }

   let trakName = req.body.name

   const readableTrackStream = new Readable()
   readableTrackStream.push(req.file.buffer)
   readableTrackStream.push(null)

   const db = getConnection()

   const bucket = new GridFSBucket( db, {
       bucketName: 'tracks'
   })

   let uploadStream = bucket.openUploadStream(trakName)
   const id = uploadStream.id
   readableTrackStream.pipe(uploadStream)

   uploadStream.on('error', () => {
      return res.status(500).json({message: 'Error Uploading your file'})
   })

   uploadStream.on('finish', () => {
      return res.status(201).json({message: `File Uploaded Successfully stored under id: ${id}`})
   })
   })

}

module.exports = { getTrack, uploadTrack}