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

module.exports = (sequelize, Sequelize) => {
    const Commitment = sequelize.define("commitment", {
      title: {
        type: Sequelize.STRING
      },
      contractCompany: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      /*executed: {
        type: Sequelize.STRING
      },
      defaultRetainage: {
        type: Sequelize.DECIMAL(10,2)
      },*/
      description: {
        type: Sequelize.STRING
      },
      /*attachments: {
        type: Sequelize.BLOB("long")
      },*/
      startDate: {
        type: Sequelize.DATEONLY
      },
      estimatedCompletionDate: {
        type: Sequelize.DATEONLY
      },
      actualCompletionDate: {
        type: Sequelize.STRING
        // type: Sequelize.DATEONLY,
        // allowNull: true,
      },
      
      signedContractReceivedDate: {
        type: Sequelize.DATEONLY
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },  
},{
        freezeTableName: true,
    });
  
    return Commitment;
};