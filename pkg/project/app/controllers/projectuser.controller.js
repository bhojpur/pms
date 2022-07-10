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

const db = require("./../models/index");
const ProjectUser = db.projectuser;
const Users = db.users;

// create a user
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userId && !req.body.projectId) {
    res.status(400).send({
      message: "Assigning incorrect! Check projectuserId and userId!"
    });
    return;
  }

  // Create a ProjectUser
  const projectuser = {
    userId: req.body.userId,
    department: req.body.department,
    position: req.body.position,
    projectId: req.body.projectId,
  };

  // Save ProjectUser in the database
  ProjectUser.create(projectuser)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ProjectUser."
      });
    });
};

// Get drawings for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;

  ProjectUser.findAll({ where: {
    userId: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving ProjectUser Aassigned for user with id=" + id
      });
    });  
};

//Find a single drawing by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ProjectUser.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving ProjectUser with id=" + id
      });
    });  
};

exports.getAllAccounts = (req, res) => {
  console.log("Accounts loading");
  Users.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User Accounts"
      });
    });  
};

// Get drawings for a given project
exports.findProjectUsers = (req, res) => {
  const id = req.params.id;

  ProjectUser.findAll({ where: {
    projectId: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Users for project id=" + id
      });
    });  
};


// Update a ProjectUser by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ProjectUser.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProjectUser was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update ProjectUser with id=${id}. Maybe ProjectUser was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProjectUser with id=" + id
      });
    });
};

// Delete a ProjectUser with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ProjectUser.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProjectUser was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ProjectUser with id=${id}. Maybe ProjectUser was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ProjectUser with id=" + id
      });
    });
};


exports.getProjectUserDetails = (req,res)=>{
  id = req.params.id;

  db.sequelize.query('select projectuser.id, projectuser.userId, projectuser.department, projectuser.position, projectuser.projectId, projects.title, projects.description, projects.location, projects.startdate, projects.enddate, projects.progressValue, projects.published FROM projectuser INNER JOIN projects ON projectuser.projectId = projects.id AND projectuser.userId = '+id+';',
   { type: db.sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not get the project user project details=" + id
    });
  });
};

exports.searchUser = (req,res)=>{
  const position = req.params.position;
  const id = req.params.id;
  db.sequelize.query('select p.position, u.username FROM projectuser p, users u where p.userId = u.id AND p.projectId = '+id+' AND p.position = "'+position+'";',
  { type: db.sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving projects."
    });
  });
};

exports.addProjectRole = (req,res)=>{

  const userId= req.body.userId;
  const roleId= req.body.roleId;
  
  //'insert into  projectuserp.position, u.username FROM  p, users u where p.userId = u.id AND p.projectId = '+id+' AND p.position = "'+position+'";',
  const queryy="INSERT into  user_roles(createdAt,updatedAt,roleId,userId) VALUES('2021-09-23 12:06:10','2021-09-23 12:06:10',"+roleId+","+userId+")"
  console.log(queryy);
  db.sequelize.query(queryy,
  { type: db.sequelize.QueryTypes.INSERT})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while inserting project user."
    });
  });
};