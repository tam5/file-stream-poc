<template>
    <div class="hello">
        <div class="pt-24">
            <h1 class="text-3xl">Hi, upload a file to test things out...</h1>

            <button @click="$refs.input.click()" type="button" class="bg-green-700 hover:bg-green-600 text-white mt-6 px-6 py-2 rounded">Click to Upload</button>
            <input ref="input" hidden type="file" />
        </div>
    </div>
</template>

<script>

function parseFile(file, callback) {
     console.log('got a file', file)
    const fileSize   = file.size;
    const chunkSize  = 64 * 1024; // bytes
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

 export default {
     name: 'Uploader',

     mounted() {
         this.$refs.input.onchange = () => {
             console.log('something changed')
             console.log('values', this.$refs.input.files)

             parseFile(this.$refs.input.files[0], (arg) => {
                 console.log('got a chunk', arg)
                 /* this.files.push(arg) */
             })
         }
     }
 }
</script>
