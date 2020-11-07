var express = require('express');
var router = express.Router();
const { tasksModel } = require("../db")
let cron = require('node-cron');
let moment = require('moment');
let x = null;

/* GET tasks listing. */
router.get('/', (req, res) => {
  tasksModel.findAll().then((tasks) => {
    res.json({
      status : "success",
      data : tasks
  })
  tasksModel.findAll().then((tasks) => {
    let dateTest = moment()
    let monthNow = dateTest.month()
    let dayNow = dateTest.day()
    let taskData = tasks.map((item) => item.toJSON())
    taskData.map((task) => {
      let taskSecond  = moment(task.jobDate).second();
      let taskMinutes = moment(task.jobDate).minutes();
      let taskHour    = moment(task.jobDate).hour();
      let taskDay     = moment(task.jobDate).day();
      let taskMonth   = moment(task.jobDate).month();
      if(monthNow == taskMonth && dayNow == taskDay) {
        cron.schedule(`${taskSecond} ${taskMinutes} ${taskHour} * * *`, () => {
          if(x != "delivered") {
            console.log("run!")
            sendNotification(message);
            x = "delivered";
          }
      }, {
            timezone: 'Europe/Istanbul'
          });
        }
      })
    })
  })
})

router.post('/', (req, res, next) => {
  const { title, subTitle, jobDate } = req.body;
  if(title && subTitle && jobDate ) {
    tasksModel.create(req.body).then((data) => {
      if(data) res.json({ status: "success", data: data });
    })
  } else {
    return res.status(500).send({ status: "error", message: "Eksik parametre" })
  }
})

module.exports = router;