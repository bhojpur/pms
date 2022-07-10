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
    const documents = require("./../controllers/documentfile.controller");
  
    var router = require("express").Router();
  
    // Create a new Doc
    router.post("/", documents.create);

    // Search documents
    router.get("/search/", documents.SearchAll);
  
    // Retrieve all Doc for a project
    router.get("/list/:id", documents.findAll);
  
    // Retrieve a single Doc with id
    router.get("/:id", documents.findOne);

    // Get all category Docs
    router.get("/cat/:id", documents.findAllCat);

    //Get Complete/Pending/Incomplete drawings
    router.get("/status/:pid/:status",documents.findAllbyStatus);

    // Get recent lists
    router.get("/data/recent/:id", documents.recent);

    // Update a Drawing with id
    router.put("/:id", documents.update);
    
    // Delete a Drawing with id
    router.delete("/:id/", documents.delete);

    app.use('/api/projects/documents', router);
  };