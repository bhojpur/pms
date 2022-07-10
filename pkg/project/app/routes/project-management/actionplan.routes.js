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
    const actionplan = require("./../../controllers/project-management/actionplan.controller");
  
    var router = require("express").Router();
  
    // Create a new Action Plan
    router.post("/", actionplan.create);

    // Update a Action Plan with id
    router.put("/update/:id", actionplan.update);
    
    // Delete a Action Plan with id
    router.put("/delete/:id", actionplan.delete);

    // Search Action Plan
    router.get("/search/:id", actionplan.SearchAll);

    // Retrieve a single punch list with id
    router.get("/single/:id", actionplan.findOne);

    // project action plans
    router.get("/action/:id",actionplan.findAll);

    // Get all type Action plans
    router.get("/type/:id", actionplan.findAlltype);

    // get approved actions
    router.get("/approved/:id",actionplan.findAllApproved);
  
    app.use('/api/projects/actionplan', router);
  };