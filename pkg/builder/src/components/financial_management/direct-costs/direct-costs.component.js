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
import DirectCostDataService from "./../../../services/directcost.service";
import ExcelDataService from "./../../../services/excelupload.service";
import { useTable } from "react-table";
import { Route, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import  Import from './excelupload.component';
import Card from 'react-bootstrap/Card';
import BudgetDataService from "./../../../services/budget.service";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import AddIcon from '@material-ui/icons/Add';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';

const DirectCostList = (props) => {
  const {id}= useParams();
  const [directcosts, setDirectCosts] = useState([]);
  const [searchCostCode, setSearchCostCode] = useState("");
  const directcostsRef = useRef();
  const [budgets, setBudgets] = useState([]);

  directcostsRef.current = directcosts;

  useEffect(() => {
    retrieveDirectCosts();
    retrieveBudgets();
  }, []);

  const retrieveBudgets = () => {
    
    BudgetDataService.getAll(id)//passing project id as id
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onChangeSearchCostCode = (e) => {
    const searchCostCode = e.target.value;
    setSearchCostCode(searchCostCode);
  };

  const retrieveDirectCosts = () => {
    
    DirectCostDataService.getAll(id)//passing project id as id
      .then((response) => {
        setDirectCosts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveDirectCosts();
  };

  const findByCostCode = () => {
  

    DirectCostDataService.findByCostCode(id,searchCostCode)//searchCostCode
      .then((response) => {
        setDirectCosts(response.data);
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

  const openDirectCost = (rowIndex) => {
    const id = directcostsRef.current[rowIndex].id;
    const pid = directcostsRef.current[rowIndex].projectId;
    //const projectId = directcostsRef.current[rowIndex].projectId;

    props.history.push("/viewdirectcost/"+pid+"/"+id);//here id is direct cost id
  };

//remove item from table
const updatePublished = (rowIndex) => {

  var data = {
    id:  directcostsRef.current[rowIndex].id,
    costCode:directcostsRef.current[rowIndex].costCode,
    description:directcostsRef.current[rowIndex].description,
    vendor:directcostsRef.current[rowIndex].vendor,
    employee:directcostsRef.current[rowIndex].employee,
    receivedDate: directcostsRef.current[rowIndex].receivedDate,
    paidDate: directcostsRef.current[rowIndex].paidDate,
   amount: directcostsRef.current[rowIndex].amount,
    published:false
    //project id ?
  };
  DirectCostDataService.update(directcostsRef.current[rowIndex].id, data)
    .then(response => {
      let newDirectCosts = [...directcostsRef.current];
      newDirectCosts.splice(rowIndex, 1);

      setDirectCosts(newDirectCosts);
      cogoToast.success("Direct Cost Deleted Successfully!");
    })
    .catch(e => {
      console.log(e);
    });
 
  };

  const deleteDirectCost = (rowIndex) => {
    const id = directcostsRef.current[rowIndex].id;
    //const projectId = directcostsRef.current[rowIndex].projectId;

    DirectCostDataService.remove(id)
      .then((response) => {
        
        //props.history.push("/directcost/"+id);

        let newDirectCosts = [...directcostsRef.current];
        newDirectCosts.splice(rowIndex, 1);

        setDirectCosts(newDirectCosts);
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const  excelSave = (blob, fileName) => {
    if (window.navigator.msSaveOrOpenBlob) { // For IE:
        navigator.msSaveBlob(blob, fileName);
    } else { // For other browsers:
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
};

  

 const exportDirectCosts = () => {
    
  ExcelDataService.download(id)
  .then(function () 
  {})
    .catch((e) => {
      console.log(e);
    });
    console.log("clicked")
};

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
        Header: "Vendor",
        accessor: "vendor",
      },
      {
        Header: "Reporting Employee",
        accessor: "employee",
      },

  {
        Header: "Received Date",
        accessor: "receivedDate",
      },
      
  {
    Header: "Paid Date",
    accessor: "paidDate",
  },
  {
        Header: "Amount (Rs.)",
        accessor: "amount",
      },
      {
        Header: "",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span style={{cursor: 'pointer'}} onClick={() => openDirectCost(rowIdx)}>
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
    data: directcosts,
  });

  return (
    <div>
        <h2>DIRECT COSTS</h2>
        <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/directcost/"+id} aria-current="page">
               Direct Costs
              </Link>
            </Breadcrumbs><hr />
               <div className="form-row mt-3">
            <div className="col-md-12 text-right">
            <Link className="btn btn-primary mr-2" to={"/adddirectcost/"+id}>{/*check this again*/}
               <AddIcon/>&nbsp;Create
                </Link>
                
              
                {/* <Link className="btn btn-import mr-2" to={"/excelupload/"+id}>
                <PublishIcon/>&nbsp;Import
                </Link> */}
               {/* <a href="#" className="btn btn-primary"  data-toggle="modal" data-target="#newCrew">+ Import</a>&nbsp;&nbsp;
         
            <div className="modal fade" id="newCrew" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <Import projectId={id}/>          
          </div>*/}
     
               {/* <button className="btn btn-primary mr-2"  onClick={exportDirectCosts} >
                Export 
                </button>*/}
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
                <option  selected value="">All Direct Costs</option>
             {budgets &&
                budgets.map((budget, index) => (
                <option
                    //value={budget.costCode}
                    //onChange={onChangeSearchCostCode}
                    key={index}
                >
                {/* unit data */}
                {budget.costCode}
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

export default DirectCostList;