const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


//gets all comments from database

router.get('/getGeneralcomments', (req, res) => {

    const queryText = `SELECT comments_general.id, comments_general.likes, comments_general.date, comments_general.order, comments_general.person_id, comments_general.topic_id, comments_general.comment, comments_general.approved, person.fb_display_name, person.fb_picture, person.id as person_id FROM "comments_general" LEFT JOIN "person" ON comments_general.person_id = person.id ORDER BY comments_general.order;`
    //pool.query is the method that sends the queryText to the database and 
    //stores the results in the variable result
    pool.query(queryText).then((result) => {
        //all of the comments are stored in result.rows; therefore we will send back
        //result.rows
        res.send(result.rows)
        //if there was an error in getting the comments from the database,
        //the error will be displayed in the console log
    }).catch((error) => {
        console.log('Error in getting comments_general: ', error);

    })

});

router.post('/addComment', (req, res) => {
    console.log('in api/comments/addComment');

    if (req.isAuthenticated()) {

        // let queryText = `INSERT INTO comments_general ("person_id", "topic_id", "comment", "approved") VALUES ($1, $2, $3, $4);`;
        // pool.query(queryText, [req.body.personId, req.body.topicId, req.body.comment, req.body.approved, req.body.order]).then((result) => {
        //     res.sendStatus(201);
        // }).catch((err) => {
        //     console.log(err);
        //     res.sendStatus(500)
        // })
        (async () => {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                //begins series of async database SELECTS to add to selectedTopicToSend
                let queryText1 = `INSERT INTO comments_general ("person_id", "topic_id", "comment", "approved") VALUES ($1, $2, $3, $4) RETURNING id;`;
                const commentId = await client.query(queryText1, [req.body.personId, req.body.topicId, req.body.comment, req.body.approved]);

                console.log(commentId.rows[0].id)

                //concatenates previous comment's order plus current comment id to make "order" and sends it to the database

                let orderToSend;

                if (req.body.lastOrder === '') {
                    orderToSend = commentId.rows[0].id
                } else {
                    orderToSend = req.body.lastOrder + '-' + commentId.rows[0].id;
                }
                let queryText2 = `UPDATE comments_general SET "order" = $1 WHERE "id" = $2;`;
                await client.query(queryText2, [orderToSend, commentId.rows[0].id]);


                await client.query('COMMIT');
                res.sendStatus(201);

            } catch (e) {

                //checks for errors at any point within the try block; if errors are found,
                //all the data is cleared to prevent data corruption
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {

                //allows res.sendStatus(201) to be sent
                client.release();
            }

            //if an error occurs in posting the game info to the database, the error will
            //appear in the console log
        })().catch((error) => {
            console.log('CATCH', error);
            res.sendStatus(500);
        })

    } else {
        res.sendStatus(403);
    }
});


router.delete('/deleteComment/:id', (req, res) => {
    //TO-DO add isAuthenticated AND status === 2 for Admin access
    if (req.isAuthenticated && req.user.status === 2) {
        let commentId = req.params.id;
        console.log('in /api/comments/deleteComment', commentId);
        let queryText = `DELETE from comments_general WHERE id = $1;`
        pool.query(queryText, [commentId])
            .then((result) => {
                console.log('successful DELETE /api/comments/deleteComment');
                res.sendStatus(200);
            })
            .catch((err) => {
                console.log('error in DELETE /api/comments/deleteComment');
                res.sendStatus(500);
            })
    }
})

router.put('/likeincrement/:id', (req, res) => {
    //in order to like an item, user must be signed in
    if (req.isAuthenticated) {
        console.log(req.body);
        pool.query(`UPDATE "comments_general" SET "likes" = $1 WHERE "id" = $2;`, [req.body.likes + 1, req.body.id]).then((result) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
    }
});

router.put('/likedecrement/:id', (req, res) => {
    //in order to like an item, user must be signed in

    if (req.isAuthenticated) {
        console.log(req.body.likes);
        pool.query(`UPDATE "comments_general" SET "likes" = $1 WHERE "id" = $2;`, [req.body.likes - 1, req.body.id]).then((result) => {
            res.sendStatus(201);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
    }
});




module.exports = router;

