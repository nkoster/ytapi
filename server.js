(_ => {

  const express = require('express')
  const app = express()
  const cors = require('cors')
  const apiPort = 3567
  const ytdl = require('ytdl-core')

  app.use(cors())
  app.use(express.json())

  const api = async (req, res) => {
    console.log(req.params.link)
    const videoUrl = 'https://www.youtube.com/watch?v=' + req.params.link
    let vid
    try {
      vid = ytdl.getVideoID(videoUrl)
    } catch (err) {
      console.log(err.message)
      process.exit(1)
    }
    const info = await ytdl.getInfo(vid)
    res.setHeader('Content-Type', 'application/json')
    const formats = info.player_response.streamingData.formats
    res.send(JSON.stringify({ 
      src: formats[formats.length - 1]
    }))
  }
  
  app.get('/:link', api)

  app.listen(apiPort, _ => 
    console.log('YT info at port', apiPort)
  ).on('error', err => console.log(err.message))

})()
