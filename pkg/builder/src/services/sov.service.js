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

class SovDataService {
  getAll(id) {
    return http.get(`/commitments/sov/list/${id}`);
  }

  get(id) {
    return http.get(`/commitments/sov/${id}`);
  }

  create(data) {
    return http.post(`/commitments/sov/`, data);
  }

/*added new*/
update(id, data){
  return http.put(`/commitments/sov/${id}`, data);
}

remove(id){
  return http.delete(`/commitments/sov/${id}`);
}

removeAll(){
  return http.delete(`/commitments/sov`);
}

findByCostCode(id,costCode){
  //return http.get(`/projects/directcost?costCode=${costCode}`);
  //return http.get(`/projects/directcost/list/${id}?costCode=${costCode}`);
  return http.get(`/commitments/sov/list/${id}/${costCode}`);
  //return http.get(`/projects/directcost?costcode=${costCode}`);

}

/*end of added new*/

/*total sovs of a project*/
getTotalSovs(id){

  return http.get(`/commitments/sov/${id}/total`);

}

getTotalSovByC(pid,id){

  return http.get(`/commitments/sov/total/${pid}/${id}`);

}

getSTotalOfCostCodes(id,costCode){

  return http.get(`/commitments/sov/${id}/${costCode}/total`);

}

}

export default new SovDataService();
