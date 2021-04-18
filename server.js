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
      console.log('live video')
    }

    info.formats
    .filter(v => v.width ? false : true)
    .map(v => {
      console.log(parseInt(v.qualityLabel))
    })

    const highestQuality = info.formats
      .map(f => f.width ? f.width : 0)
      .reduce((a, b) => a > b ? a : b)

    const indexOfHighestQuality = info.formats
      .map(f => f.width ? f.width : 0)
      .indexOf(highestQuality)

    console.log(`video: ${req.params.link}, quality: ${highestQuality}`)

    res.send(JSON.stringify({ 
      // src: info.formats[indexOfHighestQuality].url
      info
    }))

  }
  
  app.get('/:link', api)

  app.listen(apiPort, _ => 
    console.log('YT info at port', apiPort)
  ).on('error', err => console.log(err.message))

})()
