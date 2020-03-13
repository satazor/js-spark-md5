(function(root, factory){
    if(typeof define === 'function' && define.amd)
    {
        define(factory);
    }
    else if(typeof exports === 'object' && typeof module != 'undefined')
    {
        module.exports= factory();
    }
    else
    {
        this.ChunkedFileReader= factory();
    }
}(this, function(){
    'use strict';

    /**
     * Create a new instance of ChunkedFileReader.
     *
     * @class ChunkedFileReader
     * @constructor
     * @param opts {object} The options.
     *   Valid options are:
     *     maxChunkSize - Maximum chunk size
     */
    var ChunkedFileReader= function(opts){
        opts || (opts= {});

        this.maxChunkSize= (opts.maxChunkSize || 256 * 1024);
        this.listeners= {};
    };

    /**
     * Subscribe a event.
     *
     * @method subscribe
     * @param eventName {string} The event name to be subscribed
     * @param listener {function} The listener function to be invoked on events
     * @param thisObj {any} The `this' object to be used for invoking listener function
     */
    ChunkedFileReader.prototype.subscribe= function(eventName, listener, thisObj){
        this.listeners[eventName]= (this.listeners[eventName] || []);
        this.listeners[eventName].push({
            ctx: thisObj,
            fun: listener
        });
    };

    /**
     * **Internal use**
     *
     * @method publish
     * @param eventName {string} The event name
     * @param eventArgs {object} The event args to be passed each listeners
     */
    ChunkedFileReader.prototype.publish= function(eventName, eventArgs){
        (this.listeners[eventName] || []).forEach(function(listener){
            listener.fun.call(listener.ctx, eventArgs);
        }, this);
    };

    /**
     * Read chunks from File object.
     *
     * It produces some events:<br>
     * <ul>
     *   <li>"begin" - On started file reading.</li>
     *   <li>"progress" - On progress changed.</li>
     *   <li>"chunk" - On read a chunk.</li>
     *   <li>"end" - On Finished reading.</li>
     * </ul>
     *
     * @method readChunks
     * @param input {blob} The Blob (File) object
     */
    ChunkedFileReader.prototype.readChunks= function(input){
        var chunkSize= Math.min(this.maxChunkSize, input.size);
        var remainingBytes= input.size;
        var nchunks= (remainingBytes % chunkSize === 0)
            ? remainingBytes / chunkSize
            : parseInt(remainingBytes / chunkSize) + 1;

        var pos= 0;
        var reader= new FileReader(input);
        var seq= 1;
        var that= this;
        reader.onloadend= function(evt){
            if(evt.target.readyState !== FileReader.DONE)
            {
                return;
            }

            that.publish('progress', {
                nchunks: nchunks,
                done: seq,
                done_ratio: (seq / nchunks)
            });
            that.publish('chunk', {
                seq: seq,
                nchunks: nchunks,
                chunk: evt.target.result
            });
            ++seq;

            pos+= chunkSize;
            remainingBytes-= chunkSize;
            if(remainingBytes < chunkSize)
            {
                chunkSize= remainingBytes;
            }
            if(remainingBytes > 0)
            {
                reader.readAsArrayBuffer(input.slice(pos, pos + chunkSize));
            }
            else
            {
                that.publish('end', {
                    nchunks: nchunks,
                });
            }
        };

        this.publish('begin', {
            nchunks: nchunks
        });

        reader.readAsArrayBuffer(input.slice(pos, pos + chunkSize));
    };
    return ChunkedFileReader;
}));
