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
    const sov = require("./../controllers/sov.controller");
  
    var router = require("express").Router();
  
    // Create a new sov
    router.post("/", sov.create);
  
    // Retrieve all sovs for a commitment
    router.get("/list/:id", sov.findAll);
  
    // Retrieve a single sov with id
    router.get("/:id", sov.findOne);

        // Update a sov with id
  router.put("/:id", sov.update);

  // Delete a sov with id
  router.delete("/:id", sov.delete);

  router.get("/list/:id/:costCode", sov.findByCostCode);

  // get all total sovs of a project
  router.get("/:id/total", sov.getTotalSovs);

  router.get("/total/:pid/:id", sov.getTotalSovByC);

  // get total according to cost code
  //router.get("/list/:id/:costCode", directcost.getDTotalOfCostCodes);
  router.get("/:id/:costCode/total", sov.getSTotalOfCostCodes);
  
    app.use('/api/commitments/sov', router);
  };