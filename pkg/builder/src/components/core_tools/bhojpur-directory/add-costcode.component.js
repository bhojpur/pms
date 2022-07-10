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

import React, { Component } from "react";
import {Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import {AttachMoney} from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import { Breadcrumbs } from "@material-ui/core";
import CostCodeDataService from "./../../../services/costcode.service";
import ProjectDataService from "./../../../services/project.service";

class AddCostCodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
        id: this.props.match.params.id,
        title: "",
        allCostCodes:[],
        currCostCodes:[],
        notCostCodes:[],
        sendCostCodes:[], 
        disableSubmitButton: true 
        };
    }
    componentDidMount() {
        this.getCurrentCostCodes(this.state.id);
        this.getProjectData(this.state.id);
        this.getAllCostCodes();
        this.getDifference();
    }

    getDifference(){
        function comparer(otherArray){
            return function(current){
              return otherArray.filter(function(other){
                return other.value == current.value && other.display == current.display
              }).length == 0;
            }
        }


        var onlyInA = this.state.allCostCodes.filter(comparer(this.state.currCostCodes));
        var onlyInB = this.state.currCostCodes.filter(comparer(this.state.allCostCodes));

        var result = onlyInA.concat(onlyInB);

        console.log(result);
    }

    onChangeContactPersonName(e) {
        this.setState({
        contactPersonName: e.target.value
        });
    }

    getProjectData(id){
        ProjectDataService.get(id)
        .then(response => {
            this.setState({
            id : response.data.id,
            title : response.data.title 
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    getCurrentCostCodes(id){
        CostCodeDataService.getAll(id)
        .then(response => {
        this.setState({
            currCostCodes : response.data
        });
        console.log(response.data);
        })
        .catch(e => {
        console.log(e);
        });
    }

    getAllCostCodes(){
        CostCodeDataService.getEverything()
        .then(response => {
        this.setState({
            allCostCodes : response.data
        });
        console.log(response.data);
        })
        .catch(e => {
        console.log(e);
        });
    }

    
    sendCostCodes(){
        var data={};
        this.state.sendCostCodes.map((costCode) => (
            data = {
                costCode: this.state.allCostCodes[costCode],
                published: 1,
                projectId:costCode
            },
            
            CostCodeDataService.create(data).then(response => {
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
                //console.log(data);
            })
            
        )
        )
        this.displayResult();
    }

    displayResult(){
        //this.state.isSuccess
        if(true){
        cogoToast.success(
            <div>
            <div>Cost Codes added Successfully to project <b>{this.state.title}</b></div>
            </div>
        );
        }else{
        cogoToast.error(
            <div>
            <div>Failed to add Cost Codes to project <b>{this.state.title}</b></div>
            </div>
        );
        
        }
        

        setTimeout(() => {
        //window.location.href="/projects"
        }, 3000);
    }

    addToList(id){
        this.state.sendCostCodes.push(id);
        this.setState({
            disableSubmitButton : false
        });
        console.log(this.state.sendCostCodes);
    }

  render() {
    const {id, title} = this.state;


    return (
      <div className="container ">
        <h2><AttachMoney/> ASSIGN COST CODES FOR {title} </h2><hr/>

        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/admin"}>
            Core Dashboard
          </Link>
          <Link color="inherit" to={"/projects"}>
            Projects
          </Link>
          <Link color="inherit">
            Assign Cost Codes: {id}
          </Link>
        </Breadcrumbs>

        <div className="vendorBox" >

          <div className="row mt-3">
            <div className="col">
                <h5> Assigned Cost Codes:</h5>
                {this.state.currCostCodes &&
                this.state.currCostCodes.map((costCode) => (
                    <div class="card">
                        <div class="card-body">
                            <b>{costCode.costCode}</b>
                            <button className="btn btn-secondary mr-3 float-right" disabled="true" >Assigned</button>
                        </div>
                    </div>
                )
                )}

                <h5 className="mt-3"> All Cost Codes:</h5>
                {this.state.allCostCodes &&
                this.state.allCostCodes.map((costCode) => (
                    <div class="card" >
                        <div class="card-body">
                            <b>{costCode.costCode}</b>
                            <Switch color="primary" onChange={()=>this.addToList(costCode.id)} />
                        </div>
                    </div>
                )
                )}

                
            </div>
            <div className="col">
                <div className="pl-4"> 
                    <button onClick={()=>{this.sendCostCodes();}}className="btn btn-success mr-3" disabled={this.state.disableSubmitButton}>+ Add Cost Codes</button>
                    <a className="btn btn-secondary mt-2" type="reset">Cancel</a>
                </div>
            </div>
                
          </div>
            
        </div>
        

      </div>
    );
  }
  
}

export default AddCostCodes;