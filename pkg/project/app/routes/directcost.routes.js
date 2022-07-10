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

module.exports = app => {
    const directcost = require("./../controllers/directcost.controller");
    const excelController = require("./../controllers/excel.controller");
   
    var router = require("express").Router();

    // Create a new direct cost
    router.post("/", directcost.create);
  
    // Retrieve all direct costs for a project
    router.get("/list/:id", directcost.findAll);

     // Retrieve all direct costs for a project
     //router.get("/list/:id?costCode=[keyword]", directcost.findByCode);
     router.get("/list/:id/:costCode", directcost.findByCostCode);
     //router.get("/list/:id?:costCode", directcost.findByCode);
     
    // Retrieve a single direct cost with id
    router.get("/:id", directcost.findOne);

    /* Retrieve a single direct cost with id
    router.get("/:projectId/:id", directcost.findOne);*/

        // Update a direct cost with id
  router.put("/:id", directcost.update);

  // Delete a direct cost with id
  router.delete("/:id", directcost.delete);

// get total according to cost code
  //router.get("/list/:id/:costCode", directcost.getDTotalOfCostCodes);
  router.get("/:id/:costCode/total", directcost.getDTotalOfCostCodes);

// get all total direct costs of a project
  router.get("/:id/total", directcost.getTotalDirectCosts);

    app.use('/api/projects/directcost', router);
  };