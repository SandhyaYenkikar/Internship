//example 1
// console.log ("Start"); //1.executes immediately

// setTimeout (()=> {
//     console.log("Timeout Callback"); //4.executed after sync code (callback queue)
// }, 0)

// Promise.resolve().then(() => { // 3. execute before setTimeout due (micro queue)
//     console.log("Promise Resolved");
// })

// console.log("End"); //2. executes immediately (queue)

//example 2
// const fs=require("fs")

// fs.readFile("C:/Users/SandhyaYenkikar(QCIN/Desktop/node/example.txt", "utf-8", (err,data) => {
//   if (err) throw err ; 
//   console.log("1.Event loop demo")
// })

// Promise.resolve().then(() => { 
// console.log("2.Promise Resolved");
// });

// setTimeout(() => {
//     console.log("3.callback");
// },0);

// console.log("5. end of script")