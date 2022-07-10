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

import React, { useState, useEffect, useMemo, useRef } from "react";
import BudgetDataService from "./../../../services/budget.service";
import { useTable } from "react-table";
import {useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';
import CostCodeDataService from "./../../../services/costcode.service";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CheckIcon from '@material-ui/icons/Check';

const BudgetEstimates = (props) => {
  const {id}= useParams();
  const [budgets, setBudgets] = useState([]);
  const [searchCostCode, setSearchCostCode] = useState("");
  const budgetsRef = useRef();
  budgetsRef.current = budgets;
  const [costcodes, setCostCodes] = useState([]);
  const [costCodesLength, setCostCodesLength] = useState([]);
  const [budgetsLength, setBudgetsLength] = useState([]);
const [budgetTotal, setBudgetTotal]= useState("");

  useEffect(() => {
    retrieveBudgets();    
    retrieveCostCodes(); 
    calculateTotalEstimatedBudget();

  }, []);



  const retrieveCostCodes = () => {
    
    CostCodeDataService.getAll(id)//passing project id as id
      .then((response) => {
        setCostCodes(response.data);
        setCostCodesLength(response.data.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const calculateTotalEstimatedBudget=()=>{
   
    BudgetDataService.getTotalBudget(id)
    .then((response) => {
  
        setBudgetTotal(response.data)
  
      console.log(response.data);
    })
    .catch((e) => {
      console.log(e);
    });
  
  };


  
  const onChangeSearchCostCode = (e) => {
    const searchCostCode = e.target.value;
    setSearchCostCode(searchCostCode);
  };

  const retrieveBudgets = () => {
    
    BudgetDataService.getAll(id)//passing project id as id
      .then((response) => {
        setBudgets(response.data);
        setBudgetsLength(response.data.length);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByCostCode = () => {
  

    BudgetDataService.findByCostCode(id,searchCostCode)//searchCostCode
      .then((response) => {
        setBudgets(response.data);
        console.log("clicked")
        console.log(response.data)
        console.log(searchCostCode)
        console.log(id)
        console.log(response)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openBudget = (rowIndex) => {
    const id = budgetsRef.current[rowIndex].id;
    //const projectId = directcostsRef.current[rowIndex].projectId;

    props.history.push("/viewbudget/"+ id);//here id is direct cost id
  };


//remove item from table
  const updatePublished = (rowIndex) => {

    var data = {
      id:  budgetsRef.current[rowIndex].id,
      costCode: budgetsRef.current[rowIndex].costCode,
      description: budgetsRef.current[rowIndex].description,
      date: budgetsRef.current[rowIndex].date,
      estimatedBudget: budgetsRef.current[rowIndex].estimatedBudget,
      published:false
      //project id ?
    };
    BudgetDataService.update(budgetsRef.current[rowIndex].id, data)
      .then(response => {
        let newBudgets = [...budgetsRef.current];
        newBudgets.splice(rowIndex, 1);
        setBudgets(newBudgets);
        cogoToast.success("Budget Estimate Deleted Successfully!");
      })
      .catch(e => {
        console.log(e);
      });
   
    };
 /* const deleteBudget = (rowIndex) => {
    const id = budgetsRef.current[rowIndex].id;
    //const projectId = directcostsRef.current[rowIndex].projectId;

    BudgetDataService.remove(id)
      .then((response) => {
        
        //props.history.push("/directcost/"+id);

        let newBudgets = [...budgetsRef.current];
        newBudgets.splice(rowIndex, 1);

        setBudgets(newBudgets);
      })
      .catch((e) => {
        console.log(e);
      });
  };*/

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Cost Code",
        accessor: "costCode",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Estimated Budget Amount(Rs.)",
        accessor: "estimatedBudget",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span style={{cursor: 'pointer'}} onClick={() => openBudget(rowIdx)}>
              <EditIcon></EditIcon>&nbsp;&nbsp;
              </span>

              <span style={{cursor: 'pointer'}} onClick={() => {

const confirmBox = window.confirm(
  "Do you really want to delete this item ?"
)
if (confirmBox === true) {
updatePublished(rowIdx)
}
}}>
                <DeleteIcon></DeleteIcon>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: budgets
  });

  return (
    <div>
        
       
     <h3>BUDGET ESTIMATES</h3>
      <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/budgetestimates/"+id} aria-current="page">
               Budget Estimates
              </Link>
            </Breadcrumbs>
                <hr /><br />
                <div className="row">
                <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0 card-text-bhojpur"><AttachMoneyIcon/><b> {costCodesLength-budgetsLength}</b>&nbsp;Estimates Remaining.</h3>
<br />
</div></div>
<div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0 card-text-bhojpur"><CheckIcon/><b> {budgetsLength}</b>&nbsp;Estimates Done.</h3>
<br />
</div></div>
<div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0 card-text-bhojpur">Total (Rs.) :&nbsp;<b> {isNaN(parseFloat(budgetTotal).toFixed(2))?"0.00":parseFloat(budgetTotal).toFixed(2)}</b></h3>
<br />
</div></div>
</div>           
               <div className="form-row mt-3">
            <div className="col-md-12 text-right">
            <Link className="btn btn-primary mr-2" to={"/addbudget/"+id}>{/*check this again*/}
            <AddIcon/>&nbsp;Create
                </Link>
                {/* <Link className="btn btn-import mr-2" to={"/bexcelupload/"+id}>
                < PublishIcon/>&nbsp;Import
                </Link> */}
                {/*<Link className="btn btn-primary mr-2" to={"/adddirectcost/"+1}>
                Export 
                </Link>*/}
                </div>
      <div className="form-group col-md-4">
        <div className="input-group mb-3">
         {/* <input
            type="text"
            className="form-control"
            placeholder="Search by cost code"
            value={searchCostCode}
            onChange={onChangeSearchCostCode}
          />*/}
           <select 
                
                id="costCode"
           
                
                name="costCode"
                className="form-control"
            placeholder="Search by cost code"
            value={searchCostCode}
            onChange={onChangeSearchCostCode}
              >
               <option value="" selected>All Budget Estimates</option>
        {costcodes &&
                costcodes.map((c, index) => (
                <option
                    value={c.costCode}
                    onChange={onChangeSearchCostCode}
                    key={index}
                >
                {/* unit data */}
                {c.costCode}
                </option>
                ))}

                {/*<option></option>
                <option>001-Maintenance Equipment</option>
                <option>002-Sodding</option>
                <option>003-Visual Display Boards</option>
                <option>004-Site Clearing</option>
                <option>005-Dewatering</option>*/}
             
              </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCostCode}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead className="Table-header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  </div>
  </div>
  );
};

export default BudgetEstimates; 