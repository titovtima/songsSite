export default defineEventHandler((event) => {
    setResponseHeader(event, 'Content-Type', 'text/plain');
    return 'Clean-param: edit\nSitemap: https://songs.istokspb.org/sitemap.txt';
});
