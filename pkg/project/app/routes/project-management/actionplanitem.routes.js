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
    const actionplanitem = require("./../../controllers/project-management/actionplanitem.controller");
  
    var router = require("express").Router();
  
    // Create a new Action plan item
    router.post("/", actionplanitem.create);

    // Update a Action plan item with id
    router.put("/update/:id", actionplanitem.update);
    
    // Delete a Action plan item with id
    router.put("/delete/:id", actionplanitem.delete);
  
    // Retrieve a single Action plan item with id
    router.get("/:id", actionplanitem.findOne);

    // project action plans
    router.get("/all/:id",actionplanitem.findAll);

    // get completed action items
    router.get("/completed/:id",actionplanitem.findAllCompleted);

    // project action plans
    router.get("/section/:id",actionplanitem.findSection);
  
    app.use('/api/projects/actionplanitem', router);
  };