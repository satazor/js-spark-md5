# SparkMD5

SparkMD5 is a fast md5 implementation of the MD5 algorithm.
This script is based in the JKM md5 library which is the
fastest algorithm around (see: http://jsperf.com/md5-shootout/7).
This is most suitable for browser usage, because `nodejs` version might be faster.

NOTE: Please disable Firebug while performing the test!
      Firebug consumes a lot of memory and CPU and slows the test by a great margin.

## Improvements over the JKM md5 library

 * Functionality wrapped in a closure
 * Object oriented library
 * Incremental md5 (see bellow)
 * Support for array buffers (typed arrays)
 * CommonJS (it can be used in node) and AMD integration
 * Validates using jshint


Incremental md5 performs a lot better for hashing large ammounts of data, such as
files. One could read files in chunks, using the FileReader & Blob's, and append
each chunk for md5 hashing while keeping memory usage low. See example bellow.

## Usage

### Normal usage

```js
var hexHash = SparkMD5.hash('Hi there');       // hex hash
var rawHash = SparkMD5.hash('Hi there', true); // OR raw hash
```

### Incremental usage

```js
var spark = new SparkMD5();
spark.append('Hi');
spark.append(' there');
var hexHash = spark.end();                    // hex hash
var rawHash = spark.end(true);                // OR raw hash
```

### Hash a file incrementally

NOTE: If you test the code bellow using the file:// protocol in chrome you must start the browser with -allow-file-access-from-files argument.
      Please see: http://code.google.com/p/chromium/issues/detail?id=60889

```js
document.getElementById("file").addEventListener("change", function() {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = this.files[0],
        chunkSize = 2097152,                               // read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        frOnload = function(e) {
            console.log("read chunk nr", currentChunk + 1, "of", chunks);
            spark.append(e.target.result);                 // append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            }
            else {
               console.log("finished loading");
               console.info("computed hash", spark.end()); // compute hash
            }
        },
        frOnerror = function () {
            console.warn("oops, something went wrong.");
        };

    function loadNext() {
        var fileReader = new FileReader();
        fileReader.onload = frOnload;
        fileReader.onerror = frOnerror;

        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    loadNext();
});
```

You can see some more examples in the test folder.

## Documentation


### SparkMD5 class

#### SparkMD5#append(str)

Appends a string, handling UTF8 automatically.

#### SparkMD5#appendBinary(str)

Appends a binary string.

#### SparkMD5#end(raw)

Finishes the computation of the md5, returning the hex result.
If `raw` is true, the raw result will be returned instead.

#### SparkMD5#reset()

Resets the internal state of the computation.

#### SparkMD5#destroy()

Releases memory used by the incremental buffer and other aditional resources.

#### SparkMD5.hash(str, raw)

Hashes a string directly, returning the hex result.
If `raw` is true, the raw result will be returned instead.
Note that this function is `static`.

#### SparkMD5.hashBinary(str, raw)

Hashes a binary string directly, returning the hex result.
If `raw` is true, the raw result will be returned instead.
Note that this function is `static`.


### SparkMD5.ArrayBuffer class

#### SparkMD5.ArrayBuffer#append(arr)

Appends an array buffer.

#### SparkMD5.ArrayBuffer#end(raw)

Finishes the computation of the md5, returning the hex result.
If `raw` is true, the raw result will be returned instead.

#### SparkMD5.ArrayBuffer#reset()

Resets the internal state of the computation.

#### SparkMD5.ArrayBuffer#destroy()

Releases memory used by the incremental buffer and other aditional resources.

#### SparkMD5.ArrayBuffer.hash(arr, raw)

Hashes an array buffer directly, returning the hex result.
If `raw` is true, the raw result will be returned instead.
Note that this function is `static`.

## Credits

Joseph Myers (http://www.myersdaily.org/joseph/javascript/md5-text.html)
