const SpotifyWebApi = require('spotify-web-api-node');

// Initialize Spotify API client with your credentials
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://data-be-13-4.onrender.com/api/v1/callback'
  });

  module.exports = {spotifyApi};