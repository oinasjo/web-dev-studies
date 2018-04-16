const Student = require('./../models/Student');

module.exports = {
    removeUser: function(req, res) {

        let searchParam = req.body || {};

        Student.findOne(searchParam, function (err, users) {
            if (err)
                throw err;

            let user = users;

            if (isEmpty(searchParam)) {
                throw "User was not specified. Cannot remove unspecified user. Aborting."
            } else {
                if (user !== null) {
                    user.remove(function (err) {
                            res.send("User removed!");
                        });
                } else {
                    throw "User doesnt exist."
                }
            }
        })
    },
    addStudent: function(req, res) {

        let request = req.body;

        if(request !== null) {
            let studentID = request.id;
            let name = request.name;
            let email = request.email;
            let points = request.points || 0; // Not required
            let courses = request.courses || []; // Not required

            let student = new Student({
                    studentNumber: studentID,
                    name: name,
                    email: email,
                    points: points,
                    courses: courses
                });

            student.save(function (err) {
                if (err)
                    throw err;
                console.log("User saved succesfully!");
            });

            res.send(student);

        }

    },
    searchDB: function(req, res) {

        let searchParam = req.body || {};

        Student.find(searchParam, function (err, users) {
            if (err)
                throw err;

            res.send(users);

        })
    },
    findStudent: function(req, res) {
        Student
            .findOne(req.body, 'studentNumber name email', function (err, user) {
                if (err)
                    throw err;

                res.send(user);

            });
    },
    findByPoints : function (req, res) {

        let _points = req.body.points;

        Student
            .find({})
            .where('points').lt(_points) // Where less than given amount of points
            .exec(function (err, users) { // Execute callback
                let userMap = {};

                users.forEach(function (user) {
                    userMap[user._id] = user;
                });

                res.send(userMap);
            });
    },
    modifyName: function(req, res) {

        let stNum = req.body.studentNumber; // Student number
        let newName = req.body.name;

        Student
            .findOne({stNum})
            .exec(function (err, user) {
                user.name = newName;
                res.send("Name changed succesfully!");
            });
    },
    updatePoints: function(req, res) {

        let userData = req.body.user;
        let userPoints = req.body.data;

        Student
            .findOne(
                userData,
                function (err, user) {
                if (err) throw err;

                user.points = userPoints;

                res.send(user);
            });
    },
    findAllStudents: function(req, res) {
        Student
            .find({}, function(error, users) {
                let userMap = {};

                users.forEach(function (user) {
                    userMap[user._id] = user;
                });
                res.send(userMap);
            });
    },
    addCourse: function(req, res) {

        let param = req.body.id;
        let courseData = req.body.course;

        Student
            .findOne(
                param,
                function (err, user) {
                if (err) throw err;

                user.courses.push(courseData);

                user.save();

                res.send("Courses added succesfully!");

            });

    },

    // KESKEN!!!!
    changeGrade: function(user, data, grade) {

    let userData = user;
    let courseName = data;
    let courseGrade = grade;

    Student
        .findOne(
            userData,
            function (err, user) {
                if (err) throw err;

                user.courses.find(function(element) {
                    if(element.name === courseName) {
                        element.grade = courseGrade;
                        console.log("Course grade changed!");

                        element.save();
                        user.save();
                    }
                });
        });

    }
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
        }
    return true;
}