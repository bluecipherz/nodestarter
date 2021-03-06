/**
 * Created by intellicar-rinas on 2/2/18.
 */
exports.succReply = function(data, msg, res){
    res.status(200).send({"status":"SUCCESS", "data":data, "err": null, "msg":msg});
};

exports.failReply = function(data, msg, res){
    res.status(400).send({"status":"FAILURE", "err":data, "data": null, "msg":msg});
};

exports.forbidReply = function(data, msg, res){
    res.status(403).send({"status":"FAILURE", "err":data, "data": null, "msg":msg});
};

exports.authFailure = function(msg, res){
    res.status(401).send({"status":"FAILURE", "data":null, "err":{}, "msg":msg});
};

exports.generalCallback = function(res){
    return function(err, data, msg){
        if (err)
            exports.failReply(err, msg, res);
        else
            exports.succReply(data, msg, res);
    };
};

exports.checkallkeys = function(reqobj, reqkeys){
    for (let i in reqkeys)
        if (!(reqkeys[i] in reqobj))
            return [false, reqkeys[i]];
    return [true, null];
};

exports.verifyapiargs = function (reqobj, res, next, reqkeys) {
    let isallkeys = this.checkallkeys(reqobj, reqkeys);
    if(!isallkeys[0])
        this.failReply('MISSING_API_ARGUMENTS', "key not found : " + isallkeys[1], res);
    else
        next()
};

let parseHexString = function(str) {
    let result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
    return result;
};
exports.parseHexString = parseHexString;

let decimalToHex = function(d, padding) {
    let hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex.toUpperCase();
};
exports.decimalToHex = decimalToHex;

let hexToDecimal = function (hexNum) {

};
exports.hexToDecimal = hexToDecimal;

exports.parseLittleHex = function ( littleHex) {
    console.log("littleHex " + littleHex)
    return parseInt('0x'+ littleHex.match(/../g).reverse().join(''));
};

exports.hexToASCIIStr = function (hexData) {

    let s = '';
    for (let i = 0; i < hexData.length; i+=2) {
        s += String.fromCharCode(parseInt(hexData.substr(i, 2), 16))
    }
    return s;
};

exports.norange = function (start, count) {
    return Array.apply(0, Array(count))
        .map(function (element, index) {
            return index + start;
        });
};

exports.getActualMetricValue = function (pidvalue, multiplier, divisor, offset) {
    return ((parseFloat(pidvalue) * multiplier)/divisor) + parseFloat(offset);
};

exports.getIndividualPidValues = function (data) {
    //timeoffset -> pidvalue
    let pidvalues = {};
    let datasplit = data.split(",");
    for(let idx in datasplit){
        let eachValueSplit = datasplit[idx].split(":");
        pidvalues[eachValueSplit[0]] = eachValueSplit[1];
    }
    return pidvalues;
};

exports.parsePointerDtc = function (moddata) {
    let tempnew = parseHexString(moddata);
    let stored = [];
    let startpoint = 2;
    for (let i = 0 ; i < tempnew[0]; i ++){
        let nextdtci = tempnew[startpoint+1 + i*2] * 256 + tempnew[startpoint+i*2];
        let nextdtc = decimalToHex(nextdtci & 16383, 4);
        console.log(nextdtc);
        let dtccode = "P";
        if ((nextdtci >> 14) == 1)
            dtccode = "C";
        else if ((nextdtci >> 14) == 2)
            dtccode = "B";
        else if ((nextdtci >> 14) == 3)
            dtccode = "U";
        dtccode += nextdtc;

        stored.push(dtccode);
    }

    let pending = [];
    startpoint = tempnew[0] *2 + 2;
    let noofpending = (tempnew.length - startpoint)/2;
    console.log(noofpending, tempnew.length, startpoint);
    for (let i = 0 ; i < noofpending; i ++){
        let nextdtci = tempnew[startpoint+1 + i*2] * 256 + tempnew[startpoint+i*2];
        let nextdtc = decimalToHex(nextdtci & 16383, 4);
        console.log(nextdtc);
        let dtccode = "P";
        if ((nextdtci >> 14) == 1)
            dtccode = "C";
        else if ((nextdtci >> 14) == 2)
            dtccode = "B";
        else if ((nextdtci >> 14) == 3)
            dtccode = "U";
        dtccode += nextdtc;
        pending.push(dtccode);
    }
    return {"stored":stored, "pending":pending};
};

exports.parseSinoDtc = function (dtccodeHex) {
    let dtccodei = parseInt(dtccodeHex, 16);

    let dtccode = "P";
    if ((dtccodei >> 14) == 1)
        dtccode = "C";
    else if ((dtccodei >> 14) == 2)
        dtccode = "B";
    else if ((dtccodei >> 14) == 3)
        dtccode = "U";
    dtccode += dtccodeHex;

    return dtccode;
};

exports.utctimecompare = function (a,b) {
    a.utctime = parseInt(a.utctime);
    b.utctime = parseInt(b.utctime);
    if (a.utctime < b.utctime)
        return -1;
    if (a.utctime > b.utctime)
        return 1;
    return 0;
};

exports.timecompare = function (a,b) {
    a.time = parseInt(a.time);
    b.time = parseInt(b.time);
    if (a.time < b.time)
        return -1;
    if (a.time > b.time)
        return 1;
    return 0;
};

exports.getgroupid = function (grouppath) {
    let split = grouppath.split("/");
    return split[split.length - 2];
};

exports.MAX_EPOCH = 4114078851000; //2100 epoch in milli