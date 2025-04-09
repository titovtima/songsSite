# SongsSite

A frontend server for songs site. Backend repository: [github.com/titovtima/songsServer](https://github.com/titovtima/songsServer).

Two independent instances are running on [songs.istokspb.org](https://songs.istokspb.org) and [test.songs.titovtima.ru](https://test.songs.titovtima.ru).

Written on nuxt framework. Uses tailwind for styling.

Uses `API_HOST` env variable to make server process know, where to send backend API requests. Client process uses `window.location` to get this.  
Also recognizes nuxt's `HOST` and `PORT` env variables.
