/**
 * Convert byes to megabytes.
 */
export function mb(bytes) {
    return bytes / 1024 / 1024
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
