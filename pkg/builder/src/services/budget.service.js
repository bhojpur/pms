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

class BudgetDataService {
  getAll(id) {
    return http.get(`/projects/budget/list/${id}`);
  }

  get(id) {
    return http.get(`/projects/budget/${id}`);
  }

  create(data) {
    return http.post(`/projects/budget/`, data);
  }

 /*added new*/
update(id, data){
  return http.put(`/projects/budget/${id}`, data);
}

budgetUnpublished(id){
  return http.get(`/projects/budget/${id}/unpublished`);
}


remove(id){
  return http.delete(`/projects/budget/${id}`);
}

removeAll(){
  return http.delete(`/projects/budget`);
}

findByCostCode(id,costCode){
  //return http.get(`/projects/directcost?costCode=${costCode}`);
  //return http.get(`/projects/directcost/list/${id}?costCode=${costCode}`);
  return http.get(`/projects/budget/list/${id}/${costCode}`);
  //return http.get(`/projects/directcost?costcode=${costCode}`);
}

  /*end of added new*/


/*total budget of a project*/
getTotalBudget(id){

  return http.get(`/projects/budget/${id}/total`);

}

getBudgetOverview(id){

  return http.get(`/projects/budget/${id}/total/overview`);

}

}
export default new BudgetDataService();
