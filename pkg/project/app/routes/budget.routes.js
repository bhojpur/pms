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
    const budget = require("./../controllers/budget.controller");
  
    var router = require("express").Router();
  
    // Create a new Budget
    router.post("/", budget.create);
  
    // Retrieve all Budgets for a project
    router.get("/list/:id", budget.findAll);
  
   // Retrieve all budgets for a project according to cost code
     //router.get("/list/:id?costCode=[keyword]", directcost.findByCode);
     router.get("/list/:id/:costCode", budget.findByCostCode);
  
    // Retrieve a single direct cost with id
    router.get("/:id", budget.findOne);

    router.get("/:id/unpublished",budget.budgetUnpublished); 

    /* Retrieve a single direct cost with id
    router.get("/:projectId/:id", directcost.findOne);*/

        // Update a direct cost with id
  router.put("/:id", budget.update);

  // Delete a direct cost with id
  router.delete("/:id", budget.delete);

  // get all total estimated budget of a project
  router.get("/:id/total", budget.getTotalBudget);

  router.get("/:id/total/overview", budget.getBudgetOverview);

    app.use('/api/projects/budget', router);
  };