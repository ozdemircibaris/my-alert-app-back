let express = require('express');
let router = express.Router();
const { tasksModel } = require("../db")
let cron = require('node-cron');
let FCM = require('fcm-node');
let moment = require('moment');
let x = null;
let dotenv = require('dotenv');
dotenv.config()

let serverKey = process.env.FIREBASE_SERVER_KEY || 'YOURSERVERKEYHERE'; //put your server key here
let fcm = new FCM(serverKey);
/* GET tasks listing. */
router.get('/', (req, res) => {
  tasksModel.findAll({
    order: [[ 'jobDate', 'DESC' ]]
  }).then((tasks) => {
    res.json({
      status: "success",
      data: tasks
  })
  tasksModel.findAll().then((tasks) => {
    let taskData = tasks.map((item) => item.toJSON())
    taskData.map((task) => {
      let message = { //this may var according to the message type (single recipient, multicast, topic, et cetera)
        to: process.env.PHONE_KEY || 'registration_token',
        notification: {
          title: task.title,
          body: task.subTitle,
          sound: true,
        },
        data: {  //you can send only notification or only data(or include both)
          my_key: 'my value',
          my_another_key: 'my another value'
        }
      };

      let taskSecond  = moment(task.jobDate).second();
      let taskMinutes = moment(task.jobDate).minutes();
      let taskHour    = moment(task.jobDate).hour();
      let taskDay     = moment(task.jobDate).day();
      let taskMonth   = moment(task.jobDate).month();
        cron.schedule(`${taskSecond} ${taskMinutes} ${taskHour} ${taskDay} ${taskMonth} *`, () => {
          if(x != "delivered") {
            console.log("run!")
            fcm.send(message, (err, response) => {
              if (err) {
                console.log("Something has gone wrong!");
              } else {
                console.log("Successfully sent with response: ", response);
              }
            });
            x = "delivered";
            setTimeout(() => {
              x = null;
            }, 500);
          }
      }, {
            timezone: 'Europe/Istanbul'
          });
      })
    })
  })
})

router.post('/', (req, res, next) => {
  const { title, subTitle, jobDate } = req.body;
  if(title && subTitle && jobDate) {
    tasksModel.create(req.body).then((data) => {
      if(data) res.json({ status: "success", data: data });
    })
  } else {
    return res.status(500).send({ status: "error", message: "Eksik parametre" })
  }
})

module.exports = router;
