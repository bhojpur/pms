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
    const projectuser = require("./../controllers/projectuser.controller");
  
    var router = require("express").Router();
  
    // Create a new Drawing
    router.post("/", projectuser.create);
  
    // Retrieve all Project Ids for a user
    router.get("/list/:id", projectuser.findAll);
  
    // Retrieve a single project user with id
    router.get("/:id", projectuser.findOne);

    // Retrive users of a particular project
    router.get("/project/:id",projectuser.findProjectUsers);

    // Get Accounts
    router.get("/accounts/list/",projectuser.getAllAccounts);

    // Get users project details as an array
    router.get("/projectdata/user/:id", projectuser.getProjectUserDetails);

    // Get users project details as an array
    router.get("/projectdata/users/:id/:position", projectuser.searchUser);

    // Update a Tutorial with id
    router.put("/:id", projectuser.update);

    // Insert a Role with id
    router.post("/role/", projectuser.addProjectRole);
  
    // Delete a Tutorial with id
    router.delete("/:id/", projectuser.delete);
  
    app.use('/api/projects/user', router);
  };