(_ => {

  const express = require('express')
  const cors = require('cors')
  const ytdl = require('ytdl-core')

  const app = express()

  const apiPort = 3567

  app.use(cors())
  app.use(express.json())

  const api = async (req, res) => {

    const videoUrl = 'https://www.youtube.com/watch?v=' + req.params.link
    
    let vid

    let liveVideo = false
    
    res.setHeader('Content-Type', 'application/json')

    try {
      vid = ytdl.getVideoID(videoUrl)
    } catch (err) {
      console.log(err.message)
      res.send(JSON.stringify({}))
      return
    }
    
    const info = await ytdl.getInfo(vid)

    if (info.formats[0].isLive) {
      liveVideo = true
    }

    const highestQuality = info.formats
      .map(v => parseInt(v.qualityLabel) ? parseInt(v.qualityLabel) : 0)
      .reduce((a, b) => a > b ? a : b)

    const indexOfHighestQuality = info.formats
      .map(v => parseInt(v.qualityLabel) ? parseInt(v.qualityLabel) : 0)
      .indexOf(highestQuality)

    console.log(`video: ${req.params.link}, quality: ${highestQuality}p${liveVideo ? ', live video' : ''}`)

    res.send(JSON.stringify({ 
      src: info.formats[indexOfHighestQuality].url
    }))

  }
  
  app.get('/:link', api)

  app.listen(apiPort, _ => 
    console.log('YT info at port', apiPort)
  ).on('error', err => console.log(err.message))

})()
