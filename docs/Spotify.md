# Spotify

## Get Current Song

```
user/{userID}/services/{spotify}/GetCurrentSong
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |Struct|{Artist, Song, Album, Image}|
---
## Get Current Playlist

```
user/{userID}/services/{spotify}/GetCurrentPlaylist
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |Struct|{Playlist, Image}|
---

## Get Current Artist

```
user/{userID}/services/{spotify}/GetCurrentArtist
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |Struct|{Artist, Image}|
---

## Get Current Album

```
user/{userID}/services/{spotify}/GetCurrentAlbum
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |Struct|{Album, Image}|
---

## Get Current Device

```
user/{userID}/services/{spotify}/GetCurrentDevice
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|device_id  |
---

## Get Current Volume

```
user/{userID}/services/{spotify}/GetCurrentVolume
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |Int   |50         |
---

## Set Volume

```
user/{userID}/services/{spotify}/SetVolume/
```
### Args
| Args | Type | Example   |
|------|------|-----------|
|Volume|Int   |50         |

### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
---

## Play

```
user/{userID}/services/{spotify}/Play
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
---

## Pause
    
```
user/{userID}/services/{spotify}/Pause
```

### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
---

## Next

```
user/{userID}/services/{spotify}/Next
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
---

## Previous

```
user/{userID}/services/{spotify}/Previous
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
---
## Get queue

```
user/{userID}/services/{spotify}/GetQueue
```
### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |List  |[Songs]    |

---

## Get Playlists

```
user/{userID}/services/{spotify}/GetPlaylists
```

### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |List  |[Playlists]|

---

## Create Playlist

```
user/{userID}/services/{spotify}/CreatePlaylist
```

### Args
| Args | Type | Example   |
|------|------|-----------|
|Name  |String|Playlist   |

### Return Value
| Args | Type | Example   |
|------|------|-----------|
|      |String|Succes     |
