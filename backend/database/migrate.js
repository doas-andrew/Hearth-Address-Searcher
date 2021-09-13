const
    Papa      = require('papaparse'),
    postgres  = require('postgres'),
    fs        = require('fs'),
    path      = require('path'),
    // Transform CSV headers into tblProperty headers
    { headerMap, stateMap } = require('./constants.js'),
    dbObjects               = require('./objects.js'),
    dbConfig                = require('./config.js'),
    // This arg should always be this file's absolute path
    dbDir     = path.dirname(process.argv[1]),  
    dataDir   = path.join(dbDir, 'data'),
    sql       = postgres({...dbConfig})


;(async () => {
    // Create database objects (tables, indexes, etc)
    for (let i = 0; i < dbObjects.length; i++) {
        await sql.unsafe(dbObjects[i])
    }

    // Feel free to add as many files as you want in "backend/database/data",
    // but they must be CSV format and have the same headers as the Redfin file.
    let files = await fs.promises.readdir(dataDir)
    files = files.filter(f => f.substr(f.length - 4) === '.csv')

    // Parse CSVs and INSERT row data
    for (let i = 0; i < files.length; i++) {
        const fileStream = fs.createReadStream(path.join(dataDir, files[i]))
        await insert(sql, await Papa.parsePromise(fileStream))
        fileStream.destroy()
    }

    sql.end({ timeout: null })
})()

// This "papaparse" package is nice but it doesn't return promises by default
// despite being asynchronous, so we wrap it ourselves here.
Papa.parsePromise = function(fileStream) {
    return new Promise(resolve => {
        let data = []
        Papa.parse(fileStream, {
            delimiter: ',',
            dynamicTyping: true,
            header: true,
            transformHeader: header => headerMap[header],
            step: row => {
                // Data doesn't come in with a full state name
                row.data.state = stateMap[row.data.state_abbrev]
                data.push(row.data)
            },
            complete: result => resolve(data)
        })
    })
}

function insert(sql, data) {
    return sql`
        INSERT INTO tblProperty
        ${sql(data,
            'property_type',
            'address',
            'city',
            'state',
            'state_abbrev',
            'zip',
            'price',
            'square_feet',
            'beds',
            'baths',
            'year_built',
            'url'
        )}`
}
