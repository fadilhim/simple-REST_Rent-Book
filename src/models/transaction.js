const conn = require('../configs/db')

module.exports = {
    //get transaction detail from latest book
    getLatestRent: (id) => {
        return new Promise((resolve, reject) => {
          conn.query('SELECT * FROM transaction WHERE book_id = ? AND return_date IS NULL',
            id,
            (err, result) => {
                if (!err){ 
                    resolve(result)
                } else { 
                    reject(err)
                }
            })
        })
    },
    //update return transaction detail
    returnBook: (id, data) => {
        return new Promise((resolve, reject) => {
            conn.query('UPDATE transaction SET ? where trans_id = ?',
            [data, id],
            (err, result) => {
                if (!err){
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    //insert rent transaction detail
    insertTrans: (data) => {
        return new Promise((resolve, reject) => {
            conn.query('INSERT transaction SET ?',
            data,
            (err, result) => {
                if (!err) { 
                    resolve(result) 
                } else { 
                    reject(err) 
                }
            })
        })
    },
    //get all book in transaction
    getAllBorrowing: (keyword = null, sort = null, bookStatus = null, dataBegin, pageLimit) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT book.*, transaction.* FROM transaction INNER JOIN book ON transaction.book_id=book.book_id'

            const keywordIsNotNull = keyword != null
            const bookStatusIsNotNull = bookStatus != null
            const sortIsNotNull = sort != null

            if(bookStatusIsNotNull || keywordIsNotNull || sortIsNotNull){
                query += bookStatusIsNotNull || keywordIsNotNull ? `WHERE `:``
                query += keywordIsNotNull ? `title LIKE '%${keyword}%' `:''
                query += bookStatusIsNotNull && keywordIsNotNull ? `AND `:``
                query += bookStatusIsNotNull ? `return_date IS` : ''
                query += bookStatusIsNotNull && bookStatus === 'returned' ? 'NOT NULL ' : ''
                query += bookStatusIsNotNull && bookStatus === 'borrowed' ? 'NULL ' : ''

                query += sortIsNotNull ? `ORDER BY ${sort} `:''
                query += orderIsNotNull && sortIsNotNull ? order:''
            }                

            conn.query(`${query} LIMIT ?, ?`,
            [dataBegin, pageLimit],
            (err, result) => {   
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    getOneBorrowing: (id) => {
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM `transaction` WHERE book_id = ?',
            id,
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    },
    deleteBorrowing: (id) => {
        return new Promise((resolve, reject) => {
            conn.query('DELETE FROM transaction WHERE trans_id = ?',
            id,
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    },
    getBorrowingsHistoryByUserId: (id) => {
        return new Promise((resolve, reject) => {
            conn.query('select borrowings.*, `books`.`id` AS `id`,`books`.`title` AS `title`,`books`.`description` AS `description`,`books`.`image` AS `image`,`books`.`date_released` AS `date_released`,`books`.`availability` AS `availability`,`genres`.`id` AS `genre_id`,`genres`.`name` AS `genre` from `books` join `genres` on`books`.`genre_id` = `genres`.`id` join borrowings on borrowings.book_id = books.id WHERE borrowings.user_id = ?', id, (err, result) => {
                if (err) { reject(err) } else { resolve(result) }
            })
        })
    },
    getBorrowingRequests: () => {
        return new Promise((resolve, reject) => {
            conn.query('SELECT borrowings.*, books.title, users.username FROM borrowings JOIN books ON borrowings.book_id = books.id JOIN users ON users.id = borrowings.user_id WHERE is_confirmed = 0', (err, result) => {
                if (err) { reject(err) } else { resolve(result) }
            })
        })
    },
}