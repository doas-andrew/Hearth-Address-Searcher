const
    nanoexpress = require('nanoexpress'),
    app         = nanoexpress()
    dbConfig    = require('./database/config.js'),
    { Pool }    = require('pg'),
    pool        = new Pool({ ...dbConfig }),
    cors        = require('cors')


// Middleware
app.use(cors())

// Routes
app.get('/addresses', async (req, res) => {
    const [result, count] = await Promise.all([
        sqlBuilder(req.query, false),
        sqlBuilder(req.query, true)
    ])
    return res.send({ data: result.rows, total: count.rows[0].count })
});

// Start server
app.listen(3000)

// Function definitions
function sqlBuilder(q, countOnly) {
    let sql = 'SELECT'
    let params = []
    const getToken = () => '$' + (params.length + 1)

    if (countOnly) {
        sql += ' COUNT(1)'
    } else {
        sql += ' *'
    }

    sql += '\nFROM tblProperty\nWHERE 1=1\n'

    // Beds / Baths
    if (q.beds) {
        sql += `AND beds = ${getToken()}`
        params.push(q.beds)
    }

    if (q.baths) {
        sql += `AND baths = ${getToken()}`
        params.push(q.baths)
    }

    // Price
    if (q.priceMin && q.priceMax) {
        sql += `AND price BETWEEN ${getToken()}`
        params.push(q.priceMin)
        sql += `AND ${getToken()}\n`
        params.push(q.priceMax)
    } else if (q.priceMin) {
        sql += `AND price >= ${getToken()}\n`
        params.push(q.priceMin)
    } else if (q.priceMax) {
        sql += `AND price <= ${getToken()}\n`
        params.push(q.priceMax)
    }

    // Square Feet
    if (q.squareFeetMin && q.squareFeetMax) {
        sql += `AND square_feet BETWEEN ${getToken()}`
        params.push(q.squareFeetMin)
        sql += `AND ${getToken()}\n`
        params.push(q.squareFeetMax)
    } else if (q.squareFeetMin) {
        sql += `AND square_feet >= ${getToken()}\n`
        params.push(q.squareFeetMin)
    } else if (q.squareFeetMax) {
        sql += `AND square_feet <= ${getToken()}\n`
        params.push(q.squareFeetMax)
    }

    // Year Built
    if (q.yearBuiltMin && q.yearBuiltMax) {
        sql += `AND year_built BETWEEN ${getToken()}`
        params.push(q.yearBuiltMin)
        sql += `AND ${getToken()}\n`
        params.push(q.yearBuiltMax)
    } else if (q.yearBuiltMin) {
        sql += `AND year_built >= ${getToken()}\n`
        params.push(q.yearBuiltMin)
    } else if (q.yearBuiltMax) {
        sql += `AND year_built <= ${getToken()}\n`
        params.push(q.yearBuiltMax)
    }

    // Full text search
    if (q.text && q.text.length > 0) {
        // q.text = q.text.replace(' ', '<->') + ':*'
        q.text.split(' ').forEach(str => {
            sql += `AND tsv @@ to_tsquery(${getToken()})\n`
            params.push(str + ':*')
        })
    }

    // Pagination
    if (!countOnly) {
        sql += 'ORDER BY property_id ASC\n'
        sql += `LIMIT ${getToken()}\n`
        params.push(q.pageSize && q.pageSize > 0 && q.pageSize <= 500 ? q.pageSize : 50)
        sql += `OFFSET ${getToken()};`
        params.push(q.pageIndex && q.pageIndex >= 0 ? q.pageIndex * q.pageSize : 0)
    }

    // EXEC query
    // console.log(sql)
    return pool.query(sql, params)
}
