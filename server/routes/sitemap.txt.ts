export default defineEventHandler(async (event) => {
    setResponseHeader(event, 'Content-Type', 'text/plain');
    let result = '';
    result += 'https://songs.istokspb.org/\n';
    result += 'https://songs.istokspb.org/songs_lists/1\n';
    try {
        let response = await fetch('https://songs.istokspb.org/api/v1/songs/info');
        let songs = await response.json();
        for (let song of songs.list) {
            result += 'https://songs.istokspb.org/song/' + song.id + '\n';
        }
    } catch (e) {
        console.log(e);
    }
    return result;
});
