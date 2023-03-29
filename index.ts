import { credit } from './cert';
const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
// AWS.config.update(credit);


AWS.config.update({ 
    region: 'us-east-1',
    secretAccessKey: '85H57ONO4brCiZd+pvbYrIl1Y4AC66TTqvnfyfon',
    accessKeyId: 'AKIAWRW334WTYAE6ZYB3'
   });

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Summary/Description: It will retrive details of that perticular user.
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_arg.
 *
 * @return {Json} Json Object.
 */
export async function getUserDetails(user_id_arg: string) {
    var params = {
        TableName: 'Smart_Health_Table',
        KeyConditionExpression: 'user_id = :user_id AND exercise_id = :exercise_id',
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
            ':exercise_id': "0",
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items[0].user_data;
}

// How to call this function->
// (async () => {
//     const user_id = "8721f790-d3f1-4b27-8a3a-71c049abca3f";
//     let x = await getUserDetails(user_id);
//     console.log(x);
// })();



/**
 * Summary/Description: It will retrive a set of key value pairs of all the users in 
 * the database with user_id as a key and name as a value.
 *
 * @since 1.0.0.
 *
 * @param {type} none.
 *
 * @return {Dictonary}  Dictonary.
 */

export async function getAllUserNames() {
    var dic = {};
    let res = await dynamodb
        .scan({
            TableName: 'Smart_Health_Table',
        })
        .promise()
        .catch((error: Error) => console.log(error.message));

    for (let i = 0; i < res.Items.length; i++) {
        if (res.Items[i].exercise_id == 0) {
            dic[res.Items[i].user_id] = res.Items[i].user_data.first_name + " " + res.Items[i].user_data.last_name;
        }
    }
    return dic;
}

// How to call this function->
// (async () => {
//     let x = await getAllUserNames();
//     console.log(x);
// })();


/**
 * Summary/Description: It will retrive the array of all the user's user_data object with its user_id in 
 * the database which have all the profile information about the user.
 *
 * @since 1.0.0.
 *
 * @param {type} none.
 *
 * @return {Array}  Array of Json objects.
 */

export async function getAllUserData() {
    const arr = [];
    let res = await dynamodb
        .scan({
            TableName: 'Smart_Health_Table',
        })
        .promise()
        .catch((error: Error) => console.log(error.message));

    for (let i = 0; i < res.Items.length; i++) {
        if (res.Items[i].exercise_id == 0) {
            arr.push(res.Items[i]);
        }
    }
    return arr;
}

// How to call this function->
// (async () => {
//     let x = await getAllUserData();
//     console.log(x);
// })();



/**
 * Summary/Description: It will retrive all exercise record of that perticular exercise 
 * performed by that perticular user.
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_arg, exercise_id_arg.
 *
 * @return {Array} Array of Json objects.
 */

export async function getUserExerciseData(user_id_arg, exercise_id_arg) {
    var params = {
        TableName: 'Smart_Health_Table',
        KeyConditionExpression: 'user_id = :user_id AND exercise_id = :exercise_id',
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
            ':exercise_id': exercise_id_arg,
        },
    };

    let result_param = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));

    var exeparams = {
        TableName: 'Exercise_Results_Table',
        KeyConditionExpression: 'result_id = :result_id',
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ':result_id': result_param.Items[0].result_id,
        },
    };

    let res = await dynamodb.query(exeparams)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items
}

//How to call this function->
// (async () => {
//     const user_id = "1010";
//     const exercise_id = "1010";
//     let x = await getUserExerciseData(user_id, exercise_id);
//     console.log(x);
// })();


/**
 * Summary/Description: It will retrive all latest exercise record of that perticular exercise 
 * performed by that perticular user for a limit.
 * 
 * @since      1.0.0.
 *
 * @param {string, string, Int}   
 * user_id_arg, exercise_id_arg,
 * limit_arg: number which indicate how many last record you need.(must be grater than 0)
 *
 * @return {Array} Array of Json objects.
 */

export async function getUserLastFewExerciseData(user_id_arg, exercise_id_arg, limit_arg) {
    var params = {
        TableName: 'Smart_Health_Table',
        KeyConditionExpression: 'user_id = :user_id AND exercise_id = :exercise_id',
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
            ':exercise_id': exercise_id_arg,
        },
    };

    let result_param = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));

    var exeparams = {
        TableName: 'Exercise_Results_Table',
        KeyConditionExpression: 'result_id = :result_id',
        ScanIndexForward: false,
        Limit: limit_arg,
        ExpressionAttributeValues: {
            ':result_id': result_param.Items[0].result_id,
        },
    };

    let res = await dynamodb.query(exeparams)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items;
}

//How to call this function->
// (async () => {
//     const user_id = "012_user_test";
//     const exercise_id = "__ID_TimeUp_and_GO_STEADI__";
//     const limit = 2;
//     let x = await getUserLastFewExerciseData(user_id, exercise_id, limit);
//     console.log(x);
// })();



/**
 * Summary/Description: It will retrive the result ID record of that perticular exercise 
 * performed by that perticular user.
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_arg, exercise_id_arg.
 *
 * @return {Array} result ID.
 */

export async function getUserResultID(user_id_arg, exercise_id_arg) {
    var params = {
        TableName: 'Smart_Health_Table',
        KeyConditionExpression: 'user_id = :user_id AND exercise_id = :exercise_id',
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
            ':exercise_id': exercise_id_arg,
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items[0];
}

//How to call this function->
// (async () => {
//     const user_id = "1010";
//     const exercise_id = "1010";
//     let x = await getUserResultID(user_id, exercise_id);
//     console.log(x);
// })();


/**
 * Summary/Description: It will retrive the single record of that perticular exercise 
 * performed by that perticular user using range of time.
 * 
 * @since      1.0.0.
 *
 * @param {string, string, Int, Int}   
 * user_id_arg, exercise_id_arg,
 * from: start time from which records are needed. (epoc time)
 * to: end time (epoc time)
 *
 * @return {Array} Array of Json objects.
 */

export async function getTimeUserExerciseData(user_id_arg, exercise_id_arg, from, to) {
    var params = {
        TableName: 'Smart_Health_Table',
        KeyConditionExpression: 'user_id = :user_id AND exercise_id = :exercise_id',
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
            ':exercise_id': exercise_id_arg,
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));
    let items = res.Items[0];
    if (items == null) {
        console.log("No Item found!");
        return null;
    } else {
        var exeparams = {
            TableName: 'Exercise_Results_Table',
            KeyConditionExpression: 'result_id = :result_id AND time_stamp BETWEEN :from AND :to',
            // ScanIndexForward: false,
            ExpressionAttributeValues: {
                ':result_id': items.result_id,
                ":from": from,
                ":to": to,
            },
        };
        let res = await dynamodb.query(exeparams)
            .promise()
            .catch((error: Error) => console.log(error.message));
        // console.log(res.Items);
        return res.Items;
    }
}

//How to call this function->
// (async () => {
//     const user_id = "1010";
//     const exercise_id = "1010";
//     const from = 1676049750137;
//     const to = 1676320565774;
//     let x = await getTimeUserExerciseData(user_id, exercise_id, from, to);
//     console.log(x);
// })();


/**
 * Summary/Description: Adds a new user in the database table.
 * 
 * @since      1.0.0.
 *
 * @param {Json Object}  
 * userParamsArg: json object of the users data.
 * login_user_id: user_id got from cognito after authentication.
 *
 * @return {type} none.
 */

export function addUser(login_user_id, userParamsArg) {

    var date = new Date();
    var epoch = date.getTime();
    var userParams = {
        TableName: 'Smart_Health_Table',
        Item: {
            user_id: login_user_id,
            exercise_id: '0',
            user_data: userParamsArg,
            time: epoch,
        }
    };

    dynamodb.put(userParams, function (err, data) {
        if (err) console.log(err);
        else console.log("User " + login_user_id + " Added Successfully!!");
    });
}

// How to call this function->
// const login_user_id = "1010";
// const userParams = {
// 	first_name: "Ram",
// 	last_name: "Jain",
// 	age: "55",
// 	gender: "M",
//   };

// addUser(login_user_id, userParams);



/**
 * Summary/Description: Adds a exercise record to the database table for a specific user.
 * 
 * @since      1.0.0.
 *
 * @param {string, Json}   
 *  user_id_args: userid for which exercise is performed, 
 *  exercise_id_arg: exercise id of the exercise data you need,
 *  exerciseParamsArg: json object of the exercise.
 *
 * @return {type} none.
 */

export function addExercise(user_id_args, exercise_id_arg, exerciseParamsArg) {
    (async () => {
        let x = await getUserResultID(user_id_args, exercise_id_arg);
        console.log(x + "yes");
        if (x == null) {
            console.log("No Record Found! Adding new record!");
            const result_uuid = uuid();
            var params = {
                TableName: 'Smart_Health_Table',
                Item: {
                    user_id: user_id_args,
                    exercise_id: exercise_id_arg,
                    result_id: result_uuid,
                }
            };
            dynamodb.put(params, function (err, data) {
                if (err) console.log(err);
                else {
                    var date = new Date();
                    var epoch = date.getTime();
                    var paramsResult = {
                        TableName: 'Exercise_Results_Table',
                        Item: {
                            result_id: result_uuid,
                            time_stamp: epoch,
                            exercise_data: exerciseParamsArg,
                        }
                    };
                    dynamodb.put(paramsResult, function (err, data) {
                        if (err) console.log(err);
                        else console.log("Exercise " + exercise_id_arg + " Added Successfully!!");
                    });
                };
            });
        } else {
            console.log(" Result ID Found, now adding record!");
            var date = new Date();
            var epoch = date.getTime();
            var paramsResult = {
                TableName: 'Exercise_Results_Table',
                Item: {
                    result_id: x.result_id,
                    time_stamp: epoch,
                    exercise_data: exerciseParamsArg,
                }
            };
            dynamodb.put(paramsResult, function (err, data) {
                if (err) console.log(err);
                else console.log("Exercise " + exercise_id_arg + " Added Successfully!!");
            });

        }
    })();

}


//How to call this function->
// const exercise_data = {
//     pullups: "30",
//     pushups: "100",
//     result: "hello 11",
// };

// const user_id = "1010";
// const exercise_id = "1010";
// addExercise(user_id, exercise_id, exercise_data);


/**
 * Summary/Description: Updates the details of the user in the database table.
 * 
 * @since      1.0.0.
 *
 * @param {string, Json}   
 *  user_id : userid for which update exercise operation is performed,
 *  userParams: json object of the updated user_data.
 *
 * @return {type} none.
 */

export function updateUser(user_id, userParams) {
    var params = {
        TableName: 'Smart_Health_Table',
        Key: { user_id: user_id, exercise_id: "0" },
        UpdateExpression: 'set user_data = :name',
        ExpressionAttributeValues: {
            ':name': userParams
        },
    };

    dynamodb.update(params, function (err, data) {
        if (err) console.log(err);
        else console.log("Record updated successfully !!");
    });
}

// // How to call this function->
// const user_id = "123";
// userParams = {
// 	first_name: "Ram",
// 	last_name: "Jain",
// 	age: "55",
// 	gender: "M",
//   };

// updateUser(user_id, userParams);


/**
 * Summary/Description: Delete exercise record in the table for perticular time record.
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_args: userid of the user, 
 * exercise_id_arg: exersiceid of the user perticular exercise which needs to be deleted,
 * timePerformed: time exercise performed.
 *
 * @return {type} none.
 */


export function deletePreviousExerciseRecord(user_id_arg, exercise_id_arg, timePerformed) {
    (async () => {
        let x = await getUserResultID(user_id_arg, exercise_id_arg);
        if (x == null) {
            console.log("No Record Found!!")
        } else {
            var params1 = {
                TableName: 'Exercise_Results_Table',
                Key: {
                    result_id: x.result_id,
                    time_stamp: timePerformed,
                }
            };
            dynamodb.delete(params1, function (err, data) {
                if (err) console.log(err);
                else console.log("Deleted Successfully!!");
            });
        }
    })();
}

// How to call this function->
// const user_id = "1010";
// const exercise_id = "1010";
// const timePerformed = 1676049004306;
// deletePreviousExerciseRecord(user_id, exercise_id, timePerformed);



/**
 * Summary/Description: Adds a user login time in the database table.
 * 
 * @since      1.0.0.
 *
 * @param {Json Object}  
 * login_user_id: user_id got from cognito after authentication.
 *
 * @return {type} none.
 */

export function addUserTimeIn(login_user_id) {

    var date = new Date();
    var time_in_epoch = date.getTime();
    var userParams = {
        TableName: 'User_Login_Table',
        Item: {
            user_id: login_user_id,
            time_in: time_in_epoch,
        }
    };

    dynamodb.put(userParams, function (err, data) {
        if (err) console.log(err);
        else console.log("User " + login_user_id + " login time added successfully!!");
    });
}

// How to call this function->
// const login_user_id = "1010";
// addUserTimeIn(login_user_id);


/**
 * Summary/Description: Adds a user logout time in the database table.
 * 
 * @since      1.0.0.
 *
 * @param {Json Object}  
 * login_user_id: user_id got from cognito after authentication.
 * metaDataParams: Meta data about the data.
 *
 * @return {type} none.
 */

export async function addUserTimeOut(login_user_id, metaDataParams) {

    var params = {
        TableName: 'User_Login_Table',
        KeyConditionExpression: 'user_id = :user_id',
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ':user_id': login_user_id,
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));

    if (res == null) {
         console.log("No Record Found! Adding new record!");
    } else {
        let time_in_epoch = res.Items[0].time_in
        var date = new Date();
        var time_out_epoch = date.getTime();

        var userParams = {
            TableName: 'User_Login_Table',
            Item: {
                user_id: login_user_id,
                time_in: time_in_epoch,
                time_out: time_out_epoch,
                meta_data: metaDataParams
            }
        };
    
        dynamodb.put(userParams, function (err, data) {
            if (err) console.log(err);
            else console.log("User " + login_user_id + " logout time added successfully!!");
        });
    }
}

// How to call this function->
// (async () => {
//     const user_id = "1010";
//     let metaDataParams = {
//         time_spent: "87sec",
//         type: "test456",
//         data: "test456",
//       };
//     let x = await addUserTimeOut(user_id, metaDataParams);
//     console.log(x);
// })();


/**
 * Summary/Description: It will retrive all session data records of that perticular user. 
 * 
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_arg.
 *
 * @return Json Array.
 */

export async function getUserSessionTimeData(user_id_arg) {

    var params = {
        TableName: 'User_Login_Table',
        KeyConditionExpression: 'user_id = :user_id',
        ScanIndexForward: false,
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items
}

//How to call this function->
(async () => {
    const user_id = "1010";
    let x = await getUserSessionTimeData(user_id);
    console.log(x);
})();


/**
 * Summary/Description: It will retrive limited session data records of that perticular user according to limit. 
 * 
 * 
 * @since      1.0.0.
 *
 * @param {string, string}   
 * user_id_arg, limit_arg
 *
 * @return Json Array.
 */

export async function getUserLastFewSessionTimeData(user_id_arg, limit_arg) {

    var params = {
        TableName: 'User_Login_Table',
        KeyConditionExpression: 'user_id = :user_id',
        ScanIndexForward: false,
        Limit: limit_arg,
        ExpressionAttributeValues: {
            ':user_id': user_id_arg,
        },
    };

    let res = await dynamodb.query(params)
        .promise()
        .catch((error: Error) => console.log(error.message));
    return res.Items
}

//How to call this function->
// (async () => {
//     const user_id = "1010";
//     const limit = 1;
//     let x = await getUserLastFewSessionTimeData(user_id, limit);
//     console.log(x);
// })();


//module.exports = {getUserDetails, getAllUserNames, getAllUserData, getUserAllExercisesData, getUserExerciseData, addUser, addExercise, deleteExercise,updateUser, updateUserExercise};
