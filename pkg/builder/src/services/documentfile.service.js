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

import http from "./../http-common.js";

class DocumentDataService {
  getAll(id) {
    return http.get(`/projects/documents/list/${id}`);
  }

  get(id) {
    return http.get(`/projects/documents/${id}`);
  }

  create(data) {
    return http.post(`/projects/documents/`, data);
  }

  findByTitle(title) {
    return http.get(`/projects/documents/search?title=${title}`);
  }

  getCat(id){
    return http.get(`/projects/documents/cat/${id}`);
  }

  getStatus(pid,status){
    return http.get(`/projects/documents/status/${pid}/${status}`);
  }

  recent(id){
    return http.get(`/projects/documents/data/recent/${id}`);
  }

  update(id, data) {
    return http.put(`/projects/documents/${id}`, data);
  }

  delete(id) {
    return http.delete(`/projects/documents/${id}`);
  }
}

export default new DocumentDataService();