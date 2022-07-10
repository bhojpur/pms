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
import InvoiceDataService from "./../../../services/invoice.service";
import { useTable } from "react-table";
import { Route, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const InvoiceList = (props) => {
  const {id}= useParams();
  const [invoices, setInvoices] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const invoicesRef = useRef();

  invoicesRef.current = invoices;

  useEffect(() => {
    retrieveInvoices();
  }, []);

  const onChangeSearchFrom = (e) => {
    const searchFrom = e.target.value;
    setSearchFrom(searchFrom);
  };

  const retrieveInvoices = () => {
    
    InvoiceDataService.getAll(id)//passing project id as id
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveInvoices();
  };

  const findByFrom = () => {
    InvoiceDataService.findByFrom(searchFrom)
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openInvoice = (rowIndex) => {
    const id = invoicesRef.current[rowIndex].id;

    props.history.push("/viewinvoice/" + id);//here id is direct cost id
  };



  const deleteInvoice = (rowIndex) => {
    const id = invoicesRef.current[rowIndex].id;

    InvoiceDataService.remove(id)
      .then((response) => {
        
        //props.history.push("/directcost/"+id);

        let newInvoices = [...invoicesRef.current];
        newInvoices.splice(rowIndex, 1);

        setInvoices(newInvoices);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "hash",
      },
      {
        Header: "Invoice Date",
        accessor: "date",
      },
      {
        Header: "Contract Company",
        accessor: "to",
      },
      {
        Header: "",
        accessor: "from",
      },
      {
        Header: "Description",
        accessor: "description",
      },

  {
        Header: "Ammount for work completed",
        accessor: "workCompleted",
      },
      
  {
    Header: "Ammount Due",
    accessor: "ammountDue",
  },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openInvoice(rowIdx)}>
              <EditIcon></EditIcon>&nbsp;&nbsp;
              </span>

              <span onClick={() => deleteInvoice(rowIdx)}>
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
    data: invoices,
  });

  return (
    <div>
        <h3> INVOICES</h3>
               <h6>Track all direct costs that are not associated with commitments.</h6><hr />
               <div className="form-row mt-3">
            <div className="col-md-12 text-right">
            <Link className="btn btn-primary mr-2" to={"/adddirectcost/"+id}>{/*check this again*/}
                + Create
                </Link>
                <Link className="btn btn-primary mr-2" to={"/adddirectcost/"+1}>
                Import
                </Link>
                <Link className="btn btn-primary mr-2" to={"/adddirectcost/"+1}>
                Export
                </Link>
                </div>
      <div className="form-group col-md-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by contract company"
            value={searchFrom}
            onChange={onChangeSearchFrom}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByFrom}
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
          <thead>
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

export default InvoiceList;