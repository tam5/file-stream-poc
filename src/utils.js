/**
 * Convert byes to megabytes.
 */
export function mb(bytes) {
    return bytes / 1024 / 1024
}

/**
 * Parse a file in chunks.
 */
 export function parseFile(file, chunkSize, callback) {
     const fileSize = file.size;
     let offset     = 0;

     const readEventHandler = (event) => {
         if (!event.target.error) {
             offset += event.target.result.length;

             callback(event.target.result); // callback for handling read chunk
         } else {
             console.log("Read error: " + event.target.error);
             return;
         }

         if (offset >= fileSize) {
             console.log("Done reading file");
             return;
         }

         // read the next chunk
         chunkReaderBlock(offset, chunkSize, file);
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
