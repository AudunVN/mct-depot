"use strict";

const hash = require('crypto').createHash;

class DbHasher
{
    constructor()
    {
        this.algorithm = "sha1";
        this.digest = "base64";
    }

    hash(string) {
        let pointHash = hash(this.algorithm).update(string).digest(this.digest);

        return pointHash;
    }
}

module.exports = DbHasher;
