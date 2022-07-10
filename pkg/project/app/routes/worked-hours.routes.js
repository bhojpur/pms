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
    const workedHours = require("./../controllers/worked-hours.controller");
  
    var router = require("express").Router();
  
    // Create a new workedHours
    router.post("/", workedHours.create);
  
    //view timesheet detils 
    router.get("/list/:id", workedHours.getTimesheetDetails);
  
    // Update a worker with id
    router.put("/:tid/:wid", workedHours.update);
    /*  
        // Retrieve all workedHours
        router.get("/list/", workedHours.findAll);
      
        // Retrieve all published workers
        router.get("/published", worker.findAllPublished);
      
        // Retrieve a single worker with id
        router.get("/:id", worker.findOne);
          
        // Delete a worker with id
        router.delete("/:id/", worker.delete);
      
        // Delete all workers
        router.delete("/", worker.deleteAll);
      */
    app.use('/api/workedHours', router);
  };
  
  