// api/proxy/[id].js
import fetch from 'node-fetch';

const TV_CHANNELS = [
  { id: 1, url: "https://ktismaservers.in:3917/live/arktvlive.m3u8" },
  { id: 2, url: "https://livetv.adhisayamtv.org/adhisayamtv/83a062a18a761b948a73ad2ba7747a8f.sdp/playlist.m3u8" },
  { id: 3, url: "https://janya-digimix.akamaized.net/vglive-sk-512011/europe/ngrp:angeleurope_all/playlist.m3u8" },
  { id: 4, url: "https://janya-digimix2.akamaized.net/india/ngrp:angelindia_all/playlist.m3u8" },
  { id: 5, url: "https://account33.livebox.co.in/bibletvhls/live.m3u8" },
  { id: 6, url: "https://stream.blessingtv.tv:1443/blessingtv-tamillive/mystream_720p/playlist.m3u8" },
  { id: 7, url: "https://channel316.livebox.co.in/c316hls/live.m3u8" },
  { id: 8, url: "https://live.brightmeltech.in/churchtv/churchtv.m3u8" },
  { id: 9, url: "https://server1.thewebworld.in:3065/hybrid/play.m3u8" },
  { id: 10, url: "https://jrd.lanevservices.in/jrdlive-abr/jrdtam/playlist.m3u8" },
  { id: 11, url: "https://2-fss-2.streamhoster.com/pl_118/203324-1410936-1/chunklist.m3u8" },
  { id: 12, url: "https://ktismaservers.in:3870/live/gorevivaltvlive.m3u8" },
  { id: 13, url: "https://5dd3981940faa.streamlock.net/goodnewstime/goodnewstime/playlist.m3u8" },
  { id: 14, url: "https://gospeltamiltv.livebox.co.in/gospeltvhls/gospeltv.m3u8" },
  { id: 15, url: "https://gracetvcgl.livebox.co.in/Gracetvhls/Gracetv.m3u8" }
];

export default async function handler(req, res) {
  const { id } = req.query;
  const channelId = parseInt(id, 10);
  
  const channel = TV_CHANNELS.find(ch => ch.id === channelId);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }

  try {
    const response = await fetch(channel.url);
    if (!response.ok) {
      return res.status(response.status).end();
    }

    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    const body = await response.text();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');

    // Fix relative URLs in .m3u8 (if needed)
    let modifiedBody = body;
    if (contentType.includes('mpegurl') && !channel.url.includes('ktismaservers.in')) {
      const baseUrl = channel.url.substring(0, channel.url.lastIndexOf('/') + 1);
      modifiedBody = body.replace(/^(?!#)(?!https?:\/\/)(.*\.ts.*)$/gm, baseUrl + '$1');
    }

    res.status(200).send(modifiedBody);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Stream fetch failed' });
  }
}
