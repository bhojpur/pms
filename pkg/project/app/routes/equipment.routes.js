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
    const equipments = require("./../controllers/equipment.controller.js");
 
    var router = require("express").Router();
 
    // Create a new equipment
    router.post("/", equipments.create);
 
    // Retrieve all equipments
    router.get("/list/", equipments.findAll);
 
    // Retrieve all projects
    router.get("/projects", equipments.getAllProjects);
 
    // Retrieve all equipments to given project
    router.get("/allocated/:id", equipments.getAllEquipmentProjects);
 
    // Retrieve a single equipment with id
    router.get("/:id", equipments.findOne);
 
    // Update a equipment with id
    router.put("/update/:id", equipments.update);
 
    // Delete a equipment with id
    router.delete("/delete/:id/", equipments.delete);
    /* 
       // Delete all equipments
       router.delete("/", equipment.deleteAll);
     */
    app.use('/api/equipments', router);
 };