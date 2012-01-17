SparkMD5
========================
SparkMD5 is a fast md5 implementation of the MD5 algorithm.
This script is based in the JKM md5 library which is the
fastest algorithm around (see: http://jsperf.com/md5-shootout/2)

Improvements over the JKM md5 library:

 * Functionality wrapped in a closure
 * Object oriented library
 * Incremental md5 (see bellow)
 * Validates using jslint

Incremental md5 performs a lot better for hashing large ammounts of data, such as
files. One could read files in chunks, using the FileReader & Blob's, and append
each chunk for md5 hashing while keeping memory usage low. See example bellow.

Normal usage:
========================
    var hexHash = SparkMD5.hash('Hi there');       // hex hash
    var rawHash = SparkMD5.hash('Hi there', true); // OR raw hash

Incremental usage:
========================
    var spark = new SparkMD5();
    spark.append('Hi');
    spark.append(' there');
    var hexHash = spark.end();                    // hex hash
    var rawHash = spark.end(true);                // OR raw hash
   
Hash a file incrementally:
========================
    document.getElementById("file").addEventListener("change", function() {

        var fileReader = new FileReader(),
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.Slice,
            file = document.getElementById("file").files[0],
            chunkSize = 2097152,                           // read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5();

        fileReader.onload = function(e) {
            console.log("read chunk nr:", currentChunk);
            spark.appendBinary(e.target.result);           // append binary string
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            }
            else {
               console.log("finished loading");
               console.info("computed hash", spark.end()); // compute hash
            }
        };

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        };

        loadNext();
    });

TODOs:
========================
 * Add support for byteArrays
 * Add support for hmac
 * Add native support for reading files? Maybe add it as an extension?
 * Add suport for AMD
 
Credits:
========================
Joseph Myers (http://www.myersdaily.org/joseph/javascript/md5-text.html)