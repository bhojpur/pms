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

/*module.exports = app => {
    const directcost = require("./../controllers/directcost.controller");
    const excelController = require("./../controllers/excel.controller");
  
    var router = require("express").Router();

  //export
  router.get("/:id/download", excelController.download);

    app.use('/api/excel', router);
  };

  const express = require("express");
const router = express.Router();
const budget = require("./../controllers/budget.controller");
const bexcelController = require("./../controllers/bexcel.controller");
const upload = require("./../middleware/uploadExcel");

let routes = (app) => {
  router.post("/upload/budget", upload.single("file"), bexcelController.upload);
  router.get("/budgets/list", bexcelController.getBudgets);
  //router.get("/download", bexcelController.download);

  app.use("/api/excel", router);
};

module.exports = routes;*/