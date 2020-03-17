"use strict";

class DbReader
{
    constructor(db)
    {
        this.db = db;
    }

    read(type, startTime, endTime) {
        let results = [];

        let query = `
            SELECT 
                type,
                timestamp,
                data,
                metadata
            FROM telemetry
            WHERE
                type = $type,
                timestamp BETWEEN $startTime AND $endTime
            ORDER BY timestamp ASC
        `;

        let parameters = {
            $type: type,
            $startTime: startTime,
            $endTime: endTime
        }

        this.db.each(query, parameters, (err, row) => {
            if (err) {
                console.error(err.message);
            }

            console.log(`${row.type} ${row.timestamp} - ${row.data}`);

            results.push(row);
        });

        return results;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbReader;
