const
    pgtools     = require('pgtools'),
    dbConfig    = require('./config.js'),
    toolsConfig = {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password
    }


pgtools.dropdb(toolsConfig, dbConfig.database, function (err, res) {
    if (err) {
        console.error(err)
        process.exit(-1)
    }
    console.log(`Successfully dropped database "${dbConfig.database}"`)
})
