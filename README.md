# DynamoDB

# DB_Framework_APIs
(You will find the functions in index.ts)

## 1st Fuction getUserDetails(user_id)

//GET APIs ->

getUserDetails(user_id_arg) -> It will retrive details of that perticular user.

//How to call this function->

```JS
(async () => {
    const user_id = "8721f790-d3f1-4b27-8a3a-71c049abca3f";
    let x = await getUserDetails(user_id);
    console.log(x);
})();
```

//Response:
```JS
{
  last_name: 'Agrawal',
  weight: '104',
  first_name: 'Rhythm',
  age: '25',
  height: '5’2’’'
}
```

<------------------------------------------------------------------------------------------------------------>

## 2nd Fuction getAllUserData()
getAllUserNames() -> It will retrive a set of key value pairs of all the users in the database with user_id as a key and name as a value.

//How to call this function->

```JS
(async () => {
    let x = await getAllUserNames();
    console.log(x);
})();
```

//Response:
```JS
{
  '1002': 'Tim Jhonsan',
  '1008': 'Yash Agrawal',
  '1009': 'Ben Haris',
  '1010': 'Wear Neck',
  '1011': 'Jim Neck',
  '1012': 'Tom Bleck',
  '1013': 'Brain Adams',
  '100456': 'Jhon Ray',
  'f69c9348-3a5a-4054-80b0-7caf97df89a7': 'Harish Jain',
  '44520c33-97c0-409c-b0aa-e997346a2f6d': 'Jamal Rex’s'
}
```

<------------------------------------------------------------------------------------------------------------>

## 3rd Function getAllUserData()

getAllUserData() -> It will retrive the array of all the user's user_data object with its user_id in the database which have all the profile information about the user.


// How to call this function->
```JS
(async () => {
let x = await getAllUserData();
console.log(x);
})();
```


//Response:
```JS
[
{
exercise_id: '0',
user_id: '1011',
user_data: {
last_name: 'Neck',
first_name: 'Jim',
dob: '10/20/1998',
email: 'jim@uncc.edu'
}
},
{
exercise_id: '0',
user_id: '44520c33-97c0-409c-b0aa-e997346a2f6d',
user_data: {
last_name: 'Rex’s',
weight: null,
gender: 'Female',
first_name: 'Jamal',
age: null,
height: '80’'
}
},
{
exercise_id: '0',
user_id: '1002',
user_data: {
last_name: 'Jhonsan',
first_name: 'Tim',
dob: '09/18/2000',
email: 'tim@uncc.edu'
}
}
]
```
<------------------------------------------------------------------------------------------------------------>

## 4th function getUserExerciseData(user_id_arg, exercise_id_arg)

getUserExerciseData(user_id_arg, exercise_id_arg) -> It will retrive the all records of that perticular exercise performed by that perticular user.

//How to call this function->
```JS
(async () => {
let x = await getUserExerciseData('1010', '111');
console.log(x);
})();
```

//Response:
```JS
[
  {
    time_stamp: 1676323464641,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 11', pullups: '30' }
  },
  {
    time_stamp: 1676320565774,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 10', pullups: '30' }
  },
  {
    time_stamp: 1676049849062,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 9', pullups: '30' }
  },
  {
    time_stamp: 1676049750137,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 8', pullups: '30' }
  }
]
```
<------------------------------------------------------------------------------------------------------------>

## 5th function getUserLastFewExerciseData(user_id_arg, exercise_id_arg, limit_arg)

getUserLastFewExerciseData(user_id_arg, exercise_id_arg, limit_arg) -> It will retrive all latest performed exercise record of that perticular exercise performed by that perticular user for a limit.

//How to call this function->
```JS
(async () => {
    const user_id = "1010";
    const exercise_id = "1010";
    const limit = 10;
    let x = await getUserLastFewExerciseData(user_id, exercise_id, limit);
    console.log(x);
})();
```

//Response:
```JS
[
  {
    time_stamp: 1676323464641,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 11', pullups: '30' }
  },
  {
    time_stamp: 1676320565774,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 10', pullups: '30' }
  }
]
```
<------------------------------------------------------------------------------------------------------------>

## 6th function getUserResultID(user_id_arg, exercise_id_arg)

getUserResultID(user_id_arg, exercise_id_arg) -> It will retrive the result ID record of that perticular exercise performed by that perticular user.

//How to call this function->
```JS
(async () => {
    const user_id = "1010";
    const exercise_id = "1010";
    let x = await getUserResultID(user_id, exercise_id);
    console.log(x);
})();
```

//Response:
```JS
{
  result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
  exercise_id: '1010',
  user_id: '1010'
}
```
<------------------------------------------------------------------------------------------------------------>

## 7th function getTimeUserExerciseData(user_id_arg, exercise_id_arg, from, to)

getTimeUserExerciseData(user_id_arg, exercise_id_arg, from, to) -> It will retrive the single record of that perticular exercise performed by that perticular user using range of time.

//How to call this function->
```JS
(async () => {
    const user_id = "1010";
    const exercise_id = "1010";
    const from = 1676049750137;
    const to = 1676320565774;
    let x = await getTimeUserExerciseData(user_id, exercise_id, from, to);
    console.log(x);
})();
```

//Response:
```JS
[
  {
    time_stamp: 1676049750137,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 8', pullups: '30' }
  },
  {
    time_stamp: 1676049849062,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 9', pullups: '30' }
  },
  {
    time_stamp: 1676320565774,
    result_id: '89db3e7e-14f3-43ed-8626-4e0f33163da0',
    exercise_data: { pushups: '100', result: 'hello 10', pullups: '30' }
  }
]
```
<------------------------------------------------------------------------------------------------------------>


//POST APIs

## 8th function addUser(login_user_id, userParamsArg)

addUser(userParamsArg) -> Adds a new user in the database table.

// How to call this function ->

```JS
const login_user_id = "8721f790-d3f1-4b27-8a3a-71c049abca388";
userParams = {
	first_name: "Ram",
	last_name: "Jain",
	age: "55",
	gender: "M",
  };

addUser(login_user_id, userParams);
```


//Response:
```JS
User 91310ae7-34d5-4605-8ce0-f757e191e6e1 Added Successfully!!
```

<------------------------------------------------------------------------------------------------------------>

## 9th Function addExercise(user_id_args, exercise_id_arg, exerciseParamsArg)

addExercise(user_id_args, exercise_id_arg, exerciseParamsArg) -> Adds a exercise record to the database table for a specific user.

//How to call this function ->
```JS
const exercise_data = {
    pullups: "30",
    pushups: "100",
    result: "hello 12",
};

const user_id = "1010";
const exercise_id = "1010";
addExercise(user_id, exercise_id, exercise_data);
```

//Response:

```JS
Exercise {#exercise_id} Added Successfully!!
```

<------------------------------------------------------------------------------------------------------------>

//UPDATE API

## 10th Function updateUser(user_id, userParams)

updateUser(user_id, userParams) --> Updates the details of the user in the database table.

//How to call this function->

```JS
const user_id = "123";
userParams = {
	first_name: "Ram",
	last_name: "Jain",
	age: "55",
	gender: "M",
  };
	
updateUser(user_id, userParams);
```

//Response:
```JS
Record updated successfully !!
```

<------------------------------------------------------------------------------------------------------------>

## 11th Function deletePreviousExerciseRecord(user_id_arg, exercise_id_arg, timePerformed) 

deletePreviousExerciseRecord(user_id_arg, exercise_id_arg, timePerformed) --> Delete exercise record in the table for perticular time it was performed.

//How to call this function->

```JS
const user_id = "1010";
const exercise_id = "1010";
const timePerformed = 1676049004306;
deletePreviousExerciseRecord(user_id, exercise_id, timePerformed);
```

//Response:
```JS
Deleted Successfully!!
```

<------------------------------------------------------------------------------------------------------------>

## 12th Function addUserTimeIn(login_user_id) 

addUserTimeIn(login_user_id) --> Adds a user login time in the database table.

//How to call this function->

```JS
const login_user_id = "1010";
addUserTimeIn(login_user_id);
```

//Response:
```JS
User 1010 login time added successfully!!
```

<------------------------------------------------------------------------------------------------------------>

## 13th Function addUserTimeOut(login_user_id, metaDataParams)

addUserTimeOut(login_user_id, metaDataParams) --> Adds a user logout time in the database table.

//How to call this function->

```JS
(async () => {
    const user_id = "1010";
    let metaDataParams = {
        time_spent: "87sec",
        type: "test456",
        data: "test456",
      };
    let x = await addUserTimeOut(user_id, metaDataParams);
    console.log(x);
})();
```

//Response:

```JS
User 1010 logout time added successfully!!
```

<------------------------------------------------------------------------------------------------------------>


## 14th Function getUserSessionTimeData(user_id_arg)

getUserSessionTimeData(user_id_arg) --> It will retrive all session data records of that perticular user.

//How to call this function->

```JS
(async () => {
    const user_id = "1010";
    let x = await getUserSessionTimeData(user_id);
    console.log(x);
})();
```

//Response:
```JS
[
  {
    user_id: '1010',
    time_out: 1679518088321,
    meta_data: { type: 'test456', data: 'test456', time_spent: '87sec' },
    time_in: 1679518052920
  },
  {
    user_id: '1010',
    time_out: 1679517991818,
    meta_data: { type: 'test123', data: 'test123', time_spent: '47sec' },
    time_in: 1679517973047
  }
]
```

<------------------------------------------------------------------------------------------------------------>


## 15th Function getUserLastFewSessionTimeData(user_id_arg, limit_arg)

getUserLastFewSessionTimeData(user_id_arg, limit_arg) --> It will retrive last few session data records of that perticular user according to limit.

//How to call this function->

```JS
(async () => {
    const user_id = "1010";
    const limit = 1;
    let x = await getUserLastFewSessionTimeData(user_id, limit);
    console.log(x);
})();
```

//Response:
```JS
[
  {
    user_id: '1010',
    time_out: 1679518088321,
    meta_data: { type: 'test456', data: 'test456', time_spent: '87sec' },
    time_in: 1679518052920
  }
]
```

<------------------------------------------------------------------------------------------------------------>
