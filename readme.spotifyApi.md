# Spotify Playlist Fetcher

This project demonstrates how to authenticate with the Spotify API, fetch a user's playlists, and retrieve all tracks from each playlist using Node.js, Express, and the `spotify-web-api-node` library.

## Features
- User authentication with Spotify.
- Fetch user's playlists.
- Retrieve all tracks from each playlist.
- Display the playlists and tracks.

## Prerequisites
- Node.js
- npm (Node Package Manager)
- Spotify Developer Account

## URL 
https://data-be-13-4.onrender.com/

## Endpoints

- `GET api/v1/spotify/login`: Redirects the user to Spotify's login page for authentication.
- `GET api/v1/callback`: Handles the callback from Spotify, retrieves the access token, fetches the user's playlists and their tracks, and returns the data in JSON format.


## Acknowledgements

- [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)
- [Express](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [axios](https://github.com/axios/axios)