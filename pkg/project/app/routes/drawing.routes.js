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
    const drawing = require("./../controllers/drawing.controller");
  
    var router = require("express").Router();
  
    // Create a new Drawing
    router.post("/", drawing.create);

    // Search Drawings
    router.get("/search/", drawing.SearchAll);
  
    // Retrieve all Drawings for a project
    router.get("/list/:id", drawing.findAll);
  
    // Retrieve a single Drawing with id
    router.get("/:id", drawing.findOne);

    // Get all category drawings
    router.get("/cat/:id", drawing.findAllCat);

    //Get Complete/Pending/Incomplete drawings
    router.get("/status/:pid/:status",drawing.findAllbyStatus);

    // Update a Drawing with id
    router.put("/:id", drawing.update);
    
    // Delete a Drawing with id
    router.delete("/:id/", drawing.delete);

    router.get("/maxversion/version", drawing.findMaxVersion);
  
    app.use('/api/projects/drawing', router);
  };