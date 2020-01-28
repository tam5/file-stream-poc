/**
 * Convert byes to megabytes.
 */
export function mb(bytes) {
    return bytes / 1024 / 1024
}
/**
 * Convert byes to megabytes.
 */
export function toHHMMSS(seconds) {
    // multiply by 1000 because Date() requires miliseconds
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
    // if (hh > 12) {hh = hh % 12;}
    // These lines ensure you have two-digits
    if (hh < 10) {hh = "0"+hh;}
    if (mm < 10) {mm = "0"+mm;}
    if (ss < 10) {ss = "0"+ss;}

    // This formats your string to HH:MM:SS
    return hh+":"+mm+":"+ss;
}

/**
 * Convert byes to megabytes.
 */
export function megabytesToBytes(megabytes) {
    return megabytes * 1024 * 1024
}

/**
 * Parse a file in chunks.
 *
 * Optionally, add a delay between chunks so it is easier to see
 * what is happening.
 */
 export function parseFile(file, chunkSize, callback, delay = 0) {
     const fileSize = file.size;
     let offset     = 0;

     const readEventHandler = (event) => {
         if (!event.target.error) {
             offset += chunkSize;

             callback(event.target.result); // callback for handling read chunk
         } else {
             console.log("Read error: " + event.target.error);
             return;
         }

         if (offset >= fileSize) {
             console.log("Done reading file");
             return;
         }

         setTimeout(() => {
             // read the next chunk
             chunkReaderBlock(offset, chunkSize, file);
         }, delay)
     }

     const chunkReaderBlock = (_offset, length, _file) => {
         const r = new FileReader();
         const blob = _file.slice(_offset, length + _offset);
         r.onload = readEventHandler;
         r.readAsText(blob);
     }

     // now let's start the read with the first block
     chunkReaderBlock(offset, chunkSize, file);
 }
