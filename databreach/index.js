// js test
// const axios = require('axios');
const url = require("./URL");
const puppeteer = require("puppeteer");

const { PrismaClient } = require("@prisma/client");

// const http = require ('https')
// const request = require ('request')

// async function makeReq () {
//     const startTime = performance.now ()
//     const res = await axios.get(url)
//     console.log (res.data)
//     const endTime = performance.now()
//     console.log ('Js Took Time in sec : ' , (endTime - startTime) / 1000 , ' sec')
// }

const db = new PrismaClient();

async function makeConnection() {
  await db.$connect();
}

makeConnection();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);
};

async function scrappper() {
  await (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await preparePageForTests(page);

    console.warn("fetching ...");
    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
      });
      sleep(5000);

      // await page.screenshot ({path : 'ach.png'})

      console.log("Evaluating ...");
      await page.waitForSelector("div");

      const data = await page.evaluate(() =>
        Array.from(document.querySelectorAll("div"))
          .map((elem) => {
            const val = { text: elem.textContent, label: elem.ariaLabel };
            return val;
          })
          .filter((elem) => elem.label === "Report text")
      );

      // Std Roll No:
      // end

      let filterData = [];

      let start = "Std Roll No:";
      let canInsert = false;

      for (let { text, label } of data) {
        if (start === text) canInsert = true;
        if (text.length > 50) break;
        if (canInsert)
          filterData.push(
            text.trim().at(text.length - 1) === ":"
              ? text.trim().slice(0, text.length - 1)
              : text.trim()
          );
      }

      let finalRecord = {};

      for (let i = 0; i < filterData.length; i += 1) {
        // finalRecord.push ({key : filterData [i] , val : filterData[i+1] })
        finalRecord[filterData[i].replaceAll(" ", "")] = filterData[i + 1];
        i += 1;
      }

      console.log(finalRecord);

      if (finalRecord.StdRollNo === undefined)
        throw new Error("fee defaulter !!");

      // stores to database
      async function storeToPrismaInstance() {
        try {
          const addRec = await db.data.create({
            data: {
              rollNo: finalRecord.StdRollNo.replaceAll(" ", ""),
              name: finalRecord.Name,
              fName: finalRecord.FatherName,
              section: finalRecord.Section,
              cnic: finalRecord.CNIC.replaceAll("-", ""),
            },
          });
          console.log("\n", addRec, "\n Added to db \n");
        } catch (err) {
          console.error(
            "\n !! prisma fail",
            err.code === "P2002" ? err.code : err
          );
        }
      }

      await storeToPrismaInstance();
    } catch (err) {
      console.error(err);
    }

    console.log("\n\n");
    await browser.close();
  })();
}

scrappper();

// scrap it
setInterval(async () => await scrappper(), 1000 * 60);

// async function makeReq () {
//     const startTime = performance.now ()
//    http.get (url , res => {
//      const data = []

//     res.on ('data' , chunk => data.push (chunk))

//      res.on ('end' , ()=> {
//         const endTime = performance.now()
//         console.log ('Js Took Time in sec : ' , (endTime - startTime) / 1000 , ' sec')
//       //  console.log (Buffer.concat (data).toString ())
//      })

//    }).on ('error' , (err) => {
//     console.log ('Err : ' , err)
//    })
// }

// async function makeReq () {
//     const startTime = performance.now ()
//     request.get (url , function (err , res , body) {
//         if (err) console.log ( 'Error', err)
//         const endTime = performance.now()
//         console.log ('Js Took Time in sec : ' , (endTime - startTime) / 1000 , ' sec')
//         // console.log (body)
//     })
// }

// makeReq()

// console.log (res)
