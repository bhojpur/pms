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

import http from "../http-common.js";

class TimesheetDataService {
  getAll(id) {
    //console.log(id)
    return http.get(`/timesheets/list/${id}`);
  }
  /*
    getAll() {
      return http.get(`/timesheets/list/`);
    }*/

  get(id) {
    return http.get(`/timesheets/${id}`);
  }

  getUserDetails() {
    return http.get(`/timesheets/users/approved`);
  }

  create(data) {
    console.log(data)
    return http.post("/timesheets", data);

  }

  update(id, data) {
    return http.put(`/timesheets/status/${id}`, data);
  }

  findByDate(title) {
    return http.get(`/timesheets?date=${title}`);
  }

  /* 
    deleteAll() {
      return http.delete(`/projects`);
    }
  
    findByTitle(title) {
      return http.get(`/projects?title=${title}`);
    }
    userProjects(id){
      return http.get(`/projects/user/list/${id}`);
    }*/
  // findPublished(){
  //   return http.get(`/projects?published=`)
  // }
}

export default new TimesheetDataService();