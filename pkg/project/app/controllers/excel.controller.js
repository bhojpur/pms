// Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const db = require("./../models/index.js");
const Project = db.projects;
const DirectCost = db.directcosts;

const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let directcosts = [];

      rows.forEach((row) => {
        let directcost = {
          //id: row[0],
          costCode: row[0],
          description: row[1],
          category: row[2],
          vendor: row[3],
          employee: row[4],
          receivedDate: row[5],
          paidDate: row[6],
          ammount: row[7],
          projectId:row[8],
        };

        directcosts.push(directcost);
      });

      DirectCost.bulkCreate(directcosts)
      .then(() => {
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: "Fail to import data into database!",
          error: error.message,
        });
      });

  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    message: "Could not upload the file: " + req.file.originalname,
  });
}
};

const getDirectCosts = (req, res) => {
  DirectCost.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

/*------------------------------------------------------------------------------------------------------------------------------ */
const download = (req, res) => {
  const id = req.params.id;
  DirectCost.findAll({ where: {
    projectId: id
  
  }}).then((objs) => {
    let directcosts = [];

    objs.forEach((obj) => {
      directcosts.push({
        id: obj.id,
        costCode:  obj.costCode,
        description:  obj.description,
        category:  obj.category,
        vendor:  obj.vendor,
        employee:  obj.employee,
        receivedDate:  obj.receivedDate,
        paidDate:  obj.paidDate,
        amount:  obj.amount
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("DirectCost");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Cost Code", key: "costCode", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Category", key: "category", width: 10 },
      { header: "Vendor", key: "vendor", width: 10 },
      { header: "Employee", key: "employee", width: 10 },
      { header: "Received Date", key: "receivedDate", width: 10 },
      { header: "Paid Date", key: "paidDate", width: 10 },
      { header: "Amount", key: "amount", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(directcosts);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "directcosts.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

/*------------------------------------------------------------------------------------------------------------------------------ */

module.exports = {
  upload,
  download,
  getDirectCosts
};