const connection = require('./index')

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, data) => {
            if (error) {
                reject({ msg: 'fail', error })
            } else {
                // console.log(data)
                resolve({ msg: 'success', data })
            }
        })
    })
}

module.exports = query