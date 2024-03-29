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

class AlbumDataService {
  getAll(id) {
    return http.get(`/projects/photo-album/${id}`);
  }

  create(data) {
    return http.post(`/projects/photo-album/`, data);
  }

  getOne(id){
    return http.get(`/projects/photo-album/single/${id}`);
  }

  recent(){
    return http.get(`/projects/documents/photo-album/recent`);
  }

  update(id, data) {
    return http.put(`/projects/photo-album/${id}`, data);
  }

  delete(id) {
    return http.delete(`/projects/photo-album/${id}`);
  }
}

export default new AlbumDataService();