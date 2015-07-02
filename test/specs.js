/*global test, equal*/

var hasher = new SparkMD5();

function stringToArrayBuffer(str) {
    var length = str.length,
       buff = new ArrayBuffer(length),
       arr = new Uint8Array(buff),
       i;

    for (i = 0; i < length; i++) {
        arr[i] = str.charCodeAt(i);
    }

    return buff;
}

test('Hash of "hello"', function () {
    var str = 'hello',
        hash = '5d41402abc4b2a76b9719d911017c592';

    equal(SparkMD5.hash(str), hash, 'SparkMD5.hash()');
    equal(SparkMD5.hashBinary(str), hash, 'SparkMD5.hashBinary()');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), hash, 'Incremental (normal)');
    hasher.appendBinary(str);
    equal(hasher.end(), hash, 'Incremental (binary)');
});

test('Hash of 64 bytes', function () {
    var str = '5d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c592',
        hash = 'e0b153045b08d59d4e18a98ab823ac42';

    equal(SparkMD5.hash(str), hash, 'SparkMD5.hash()');
    equal(SparkMD5.hashBinary(str), hash, 'SparkMD5.hashBinary()');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), hash, 'Incremental (normal)');
    hasher.appendBinary(str);
    equal(hasher.end(), hash, 'Incremental (binary)');
});

test('Hash of 128 bytes', function () {
    var str = '5d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c592',
        hash = 'b12bc24f5507eba4ee27092f70148415';

    equal(SparkMD5.hash(str), hash, 'SparkMD5.hash()');
    equal(SparkMD5.hashBinary(str), hash, 'SparkMD5.hashBinary()');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), hash, 'Incremental (normal)');
    hasher.appendBinary(str);
    equal(hasher.end(), hash, 'Incremental (binary)');
});

test('Hash of 160 bytes', function () {
    var str = '5d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c5925d41402abc4b2a765d41402abc4b2a76b9719d911017c5925d41402abc4b2a76b9719d911017c5925d41402abc4b2a76',
        hash = '66a1e6b119bf30ade63378f770e52549';

    equal(SparkMD5.hash(str), hash, 'SparkMD5.hash()');
    equal(SparkMD5.hashBinary(str), hash, 'SparkMD5.hashBinary()');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), hash, 'Incremental (normal)');
    hasher.appendBinary(str);
    equal(hasher.end(), hash, 'Incremental (binary)');
});

test('Incremental usage', function () {
    hasher.reset();
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456a234');

    equal(hasher.end(), '014d4bbb02c66c98249114dc674a7187', 'Incremental (normal) of 20+20+24');

    hasher.reset();
    hasher.appendBinary('5d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a421456a234');

    equal(hasher.end(), '014d4bbb02c66c98249114dc674a7187', 'Incremental (binary) of 20+20+24');

    hasher.reset();
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456');

    equal(hasher.end(), 'f15937a66ae98c76c0dfbc6df2b75703', 'Incremental (normal) of 20+20+20');

    hasher.reset();
    hasher.appendBinary('5d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a421456');

    equal(hasher.end(), 'f15937a66ae98c76c0dfbc6df2b75703', 'Incremental (binary) of 20+20+20');

    hasher.reset();
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a4214565d41402abc4b2a4214565d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456');

    equal(hasher.end(), '45762198a57a35c8523915898fb8c68c', 'Incremental (normal) of 20+60+20');

    hasher.reset();
    hasher.appendBinary('5d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a4214565d41402abc4b2a4214565d41402abc4b2a421456');
    hasher.appendBinary('5d41402abc4b2a421456');

    equal(hasher.end(), '45762198a57a35c8523915898fb8c68c', 'Incremental (binary) of 20+60+20');
});

test('Incremental usage (resume)', function () {
    var md5,
        state,
        buffHasher = new SparkMD5.ArrayBuffer();

    hasher.reset();
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456a234');
    md5 = hasher.end();

    hasher.reset();
    hasher.append('5d41402abc4b2a421456');
    state = hasher.getState();
    hasher.reset();
    hasher.setState(state);
    hasher.append('5d41402abc4b2a421456');
    hasher.append('5d41402abc4b2a421456a234');

    equal(hasher.end(), md5, 'MD5 should be the same');
    equal(md5, '014d4bbb02c66c98249114dc674a7187', 'Actual MD5 check');

    // Same tests but for buffers
    buffHasher.reset();
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456a234'));
    md5 = buffHasher.end();

    buffHasher.reset();
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    state = buffHasher.getState();

    buffHasher.reset();
    buffHasher.setState(state);
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456a234'));

    equal(buffHasher.end(), md5, 'MD5 should be the same');
    equal(md5, '014d4bbb02c66c98249114dc674a7187', 'Actual MD5 check');
});

test('Incremental usage (array buffer + resume with JSON.stringify)', function () {
    var md5,
        state,
        buffHasher = new SparkMD5.ArrayBuffer();

    // Same tests but for buffers
    buffHasher.reset();
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456a234'));
    md5 = buffHasher.end();

    buffHasher.reset();
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    state = JSON.stringify(buffHasher.getState());

    buffHasher.reset();
    buffHasher.setState(JSON.parse(state));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456'));
    buffHasher.append(stringToArrayBuffer('5d41402abc4b2a421456a234'));

    equal(buffHasher.end(), md5, 'MD5 should be the same');
    equal(md5, '014d4bbb02c66c98249114dc674a7187', 'Actual MD5 check');
});

test('UTF-8', function () {
    var str = 'räksmörgås';

    equal(SparkMD5.hash(str), 'e462805dcf84413d5eddca45a4b88a5e', 'SparkMD5.hash() of "' + str + '"');
    equal(SparkMD5.hashBinary(str), '09d9d71ec8a8e3bc74e51ebd587154f3', 'SparkMD5.hashBinary() of "' + str + '"');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), 'e462805dcf84413d5eddca45a4b88a5e', 'Incremental (normal) of "' + str + '"');

    hasher.reset();
    hasher.appendBinary(str);
    equal(hasher.end(), '09d9d71ec8a8e3bc74e51ebd587154f3', 'Incremental (binary) of "' + str + '"');

    str = '\u30b9\u3092\u98df';

    equal(SparkMD5.hash(str), '453931ab48a4a5af69f3da3c21064fc9', 'SparkMD5.hash() of "' + str + '"');
    equal(SparkMD5.hashBinary(str), '24e3399be06b7cf59dbd848e18d9246c', 'SparkMD5.hashBinary() of "' + str + '"');

    hasher.reset();
    hasher.append(str);
    equal(hasher.end(), '453931ab48a4a5af69f3da3c21064fc9', 'Incremental (normal) of "' + str + '"');

    hasher.reset();
    hasher.appendBinary(str);
    equal(hasher.end(), '24e3399be06b7cf59dbd848e18d9246c', 'Incremental (binary) of "' + str + '"');
});

test('Hashing a PNG - ArrayBuffer vs binary string', function () {
    var binString,
        buffer,
        buffHasher,
        binHasher;

    if (typeof window === 'undefined') {
        equal('ok', 'ok');
        return; // this test doesn't make sense in node, no ArrayBuffers
    }

    // 1x1 transparent PNG
    binString = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=');
    buffer = stringToArrayBuffer(binString);

    buffHasher = new SparkMD5.ArrayBuffer();
    buffHasher.append(buffer);

    binHasher = new SparkMD5();
    binHasher.appendBinary(binString);

    equal(buffHasher.end(), binHasher.end(), 'md5 sum should be the same for both binary strings and ArrayBuffers');
});
