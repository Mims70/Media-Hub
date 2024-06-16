const { spotifyApi } = require('../server/config/spotify.config');

const login = (req, res) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(['playlist-read-private', 'playlist-read-collaborative']);
  res.redirect(authorizeURL);
};

// Handle Spotify callback after user grants permissions
const callback = async (req, res) => {
  const { code } = req.query;
  console.log("Authorization code received:", code);

  if (!code) {
    console.error("No authorization code received.");
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Use accessToken to make authenticated requests to Spotify API
    spotifyApi.setAccessToken(accessToken);

    // Fetch user's profile information
    const { body: userProfile } = await spotifyApi.getMe();
    console.log("User Profile:", userProfile);

    // Extract the User ID from the profile
    const userId = userProfile.id;
    console.log('User ID:', userId);

    // Get user's playlists
    const playlistsData = await spotifyApi.getUserPlaylists(userId);
    const playlists = playlistsData.body.items;
    console.log("Playlists Data:", playlistsData);
    console.log("Playlists:", playlists);

    if (!playlists.length) {
      console.log("No playlists found for the user.");
    }

    // Function to fetch all tracks from a playlist
    const fetchAllTracks = async (playlistId) => {
      let tracks = [];
      let offset = 0;
      const limit = 100; // Maximum allowed by Spotify

      while (true) {
        const { body } = await spotifyApi.getPlaylistTracks(playlistId, { offset, limit });
        tracks = tracks.concat(body.items);
        if (tracks.length >= body.total) {
          break;
        }
        offset += limit;
      }
      return tracks;
    };

    // Fetch tracks for each playlist
    const playlistsWithTracks = await Promise.all(playlists.map(async (playlist) => {
      const tracks = await fetchAllTracks(playlist.id);
      return {
        name: playlist.name,
        tracks: tracks.map(track => ({
          name: track.track.name,
          artist: track.track.artists.map(artist => artist.name).join(', '),
          album: track.track.album.name
        }))
      };
    }));

    console.log("Playlists with Tracks:", playlistsWithTracks);

    // Render playlists with tracks in frontend (or handle the data as needed)
    res.json({ userId, playlists: playlistsWithTracks });
  } catch (error) {
    console.error('Error authenticating with Spotify:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  login,
  callback
};