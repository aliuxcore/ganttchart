var data1={
        "items":[{
            "id":"59719",
            "items":[{
                    "desc":"需要完成的任务1 完成群2.0任务AAA任务:未开始",
                    "endTime":1358351999000,
                    "name":"需要完成的任务1 完成群2.0任务AAA任务:未开始",
                    "postId":201000,
                    "startTime":1358179200000,
                    "status":"RUNNING",
                    "type":"GanttChartTask",
                    "id":"001"
                    },
                    {
                    "desc":"需要完成的任务1 完成群2.0任务BBB任务：进行中",
                    "endTime":1358438399000,
                    "name":"需要完成的任务1 完成群2.0任务BBB任务：进行中",
                    "postId":201001,
                    "startTime":1358265600000,
                    "status":"RUNNING",
                    "type":"GanttChartTask",
                    "id":"002"
                    },
                    {
                    "desc":"需要完成的任务1 完成群2.0任务BBB任务：延期",
                    "endTime":1358524799000,
                    "name":"需要完成的任务1 完成群2.0任务BBB任务：延期",
                    "postId":201002,
                    "startTime":1358352000000,
                    "status":"DELAY",
                    "type":"GanttChartTask",
                    "id":"003"
                    },
                    {
                    "desc":"需要完成的任务1 完成群2.0任务BBB任务：完成",
                    "endTime":1358611199000,
                    "name":"需要完成的任务1 完成群2.0任务BBB任务：完成",
                    "postId":201003,
                    "startTime":1358179200000,
                    "status":"SUCCEEDED",
                    "type":"GanttChartTask",
                    "id":"004"
                    },
                    {
                    "desc":"需要完成的任务1 完成群2.0任务BBB任务：取消",
                    "endTime":1359129599000,
                    "name":"需要完成的任务1 完成群2.0任务BBB任务：取消",
                    "postId":201004,
                    "startTime":1358611200000,
                    "status":"KILLED",
                    "type":"GanttChartTask",
                    "id":"005"
                    }
                ],
                "name":"王霆（廷魁）"
            },
            {
                "id":"59720",
                "items":[
                {
                    "desc":"需要完成的任务1 完成群2.0任务CCCC",
                    "endTime":1359043199000,
                    "name":"需要完成的任务1 完成群2.0任务CCCC",
                    "postId":201005,
                    "startTime":1358697600000,
                    "status":"RUNNING",
                    "type":"GanttChartTask",
                    "id":"006"
                }
                ],
                "name":"张珊（发飙）"
            }]
        };


var data={
    "items":[
        {
            "number":2,
            "time":1381334400000
        },
        {
            "number":7,
            "time":1381420800000
        },
        {
            "number":10,
            "time":1381507200000
        },
        {
            "number":20,
            "time":1381593600000
        },
        {
            "number":30,
            "time":1381680000000
        },
        {
            "number":40,
            "time":1381766400000
        },
        {
            "number":100,
            "time":1381852800000
        },
        {
            "number":70,
            "time":1381939200000
        },
        {
            "number":80,
            "time":1382025600000
        },
        {
            "number":200,
            "time":1382112000000
        },
        {
            "number":10,
            "time":1382198400000
        },
        {
            "number":10,
            "time":1382284800000
        },
        {
            "number":30,
            "time":1382371200000
        },
        {
            "number":10,
            "time":1382457600000
        },
        {
            "number":1,
            "time":1382544000000
        }
    ]
};

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

//var taskNames = [ "李四", "李四1", "李四2", "李四3", "李四4","李四5" ];

/*tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = tasks[tasks.length - 1].endDate;
tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = tasks[0].startDate;

var timeDomainString = "1day";*/

var proCalendar=d3.proCalendar().processData(data);
proCalendar();

var gantt = d3.gantt().taskStatus(taskStatus).processData(data1);

//gantt.setContainer(d3.select(".ganttchartContainer"));
gantt.timeDomainMode("fit");
//changeTimeDomain(timeDomainString);

gantt();

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
    case "1hr":
    format = "%H:%M:%S";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
    break;
    case "3hr":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
    break;

    case "6hr":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
    break;

    case "1day":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
    break;

    case "1week":
    format = "%a %H:%M";
    gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
    break;
    default:
    format = "%H:%M"

    }
    gantt.tickFormat(format);
    gantt.redraw(tasks);
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
    lastEndDate = tasks[tasks.length - 1].endDate;
    }
    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    tasks.push({
    "startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
    "endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
    "taskName" : taskName,
    "status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};
