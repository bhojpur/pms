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

import React, { Component } from 'react';
import { jsPDF } from "jspdf";
import CostCodeDataService from "./../../services/costcode.service";
//import mainIcon from "./././../assets/logo.png";getProjectUsers(id)

// Default export is A4 paper, portrait, using millimeters for units

class Report extends Component {

    constructor(props) {
        super(props);
        var today = new Date(),

        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        this.state={

            type:"",
            currentDate: date,
            currentTime: today.toLocaleTimeString(),
            isPDF: false,
            costCodes: [],
            sad: "",
            projectUsers: []
        }
    }

    componentDidMount() {
        this.getProjectCostCodes(2)
    }

    generatePDF(project,noUsers){

        const doc = new jsPDF();

        doc.setFont("times");
        doc.setFontSize(12);
        doc.text("Date :"+this.state.currentDate,160, 10, null, null)
        doc.text("Time :"+this.state.currentTime,160, 16, null, null)
        
        //line(x1, y1, x2, y2, style) START :0 END:
        doc.line(10, 20, 200, 20); // horizontal line

        //doc.addImage("/146874499_433250618091789_8408160976424755805_o.png",'PNG', 20, 40,1200,955);//components\report\report.component.js
        
        doc.setFont("times");
        doc.setFontSize(22);
        //doc.text("Bhojpur PMS - Project Office",105, 40, null, null, "center");
        doc.setFont("times", "bold");
        doc.setFontSize(18);

        const title = "Project Title: ".concat(project.title);
        doc.text( title,100, 50, "center");

        //PROJECT ID AND STUFF
        doc.setFont("times","normal");
        doc.setFontSize(12);
        doc.text("Project ID :",10, 65, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(project.id.toString(),35, 65, null, null, "left");

        //LOCATION
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("Location   :",10, 72, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(project.location,35, 72, null, null, "left");

        //Start Date
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("Start Date   :",10, 81, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(project.startdate,35, 81, null, null, "left");

        //End Date
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("End Date   :",95, 81, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(project.startdate,120, 81, null, null, "left");

        //COST CODES
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("Cost Codes   :",10, 88, null, null, "left");

        doc.setFont("times", "bold");
        var x1=35
        // temp.forEach((item, index)=>{
        //     doc.text(item,x1, 88, null, null, "left");
        //     x1+=5;
        // })

        // doc.text("<CODE1 >",35, 88, null, null, "left");
        // doc.text("<CODE2 >",59, 88, null, null, "left");
        // doc.text("<CODE3 >",83, 88, null, null, "left");


        //other details-
        //DESCRIPTION
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("Description :",10, 95, null, null, "left");

        doc.setFont("times", "normal");
        doc.text(project.description,10, 101, null, null, "left");

        //WORKING EMPLOYEES
        //LOCATION
        // doc.setFontSize(16);
        // doc.setFont("times","normal");
        // doc.text(" No. of Employees  :",10, 114, null, null, "left");

        // doc.setFont("times", "bold");
        // doc.text(noUsers,59, 114, null, null, "left");

        //final save
        //TABLE OF WORKING EMPLOYEES
        const tempdata=[
            {
            empID:"1",
            name: "Ivar Boneless",
            role: "Engineer",
            enrollDate: "2021-9-12",
            mobileNo: "0723235665"
            },
            {
            empID:"2",
            name: "Ragnar Lothbrok",
            role: "Engineer",
            enrollDate: "2021-9-12",
            mobileNo: "0724235665"
            }
        ]

        const headers=["empID","name","role","enrollDate","mobileNo"];

        //doc.table(12, 117, tempdata, headers,{ fontSize: 10 },{ autoSize: true });

        var saveName1="Status_report_"+project.title+"_"+this.state.currentDate+".pdf";
        doc.save(saveName1);
    }

    generateProjectReport(projects,a,b,c){
        let doc = new jsPDF();

        doc.setFont("times");
        doc.setFontSize(12);
        doc.text("Date :"+this.state.currentDate,160, 10, null, null)
        doc.text("Time :"+this.state.currentTime,160, 16, null, null)
        
        //line(x1, y1, x2, y2, style) START :0 END:
        doc.line(10, 20, 200, 20); // horizontal line

        //doc.addImage("/146874499_433250618091789_8408160976424755805_o.png",'PNG', 20, 40,1200,955);//components\report\report.component.js
        
        doc.setFont("times");
        doc.setFontSize(22);
        //doc.text("Bhojpur PMS - Project Office",105, 40, null, null, "center");
        doc.setFont("times", "bold");
        doc.setFontSize(18);

        const title = "Project Status as of: ".concat(this.state.currentDate);
        doc.text( title,100, 50, "center");

        //ONGOING PROJECTS
        doc.setFont("times","normal");
        doc.setFontSize(12);
        doc.text("No. of ongoing Projects       :",10, 65, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(projects.length.toString(),65, 65, null, null, "left");

        //EMPLOYEES
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("No. of working Employees   :",10, 72, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(c.toString() ,65, 72, null, null, "left");

        //VENDORS AND SUBCONTRACTORS
        doc.setFontSize(12);
        doc.setFont("times","normal");
        doc.text("No. of Vendors            :",10, 79, null, null, "left");

        doc.setFont("times", "bold");
        doc.text(a.toString() ,65, 79, null, null, "left");

        console.log(projects)
        var x1=35
        
        // //final save
        // //TABLE OF ONGOING PROJECTS
        var tempdata=[];
        
        
        projects.forEach((project)=>{
            var temp={
                id: project.id.toString(),
                title: project.title,
                location: project.location,
                startdate: project.startdate.toString(),
                enddate: project.enddate.toString()
            };
            tempdata.push(temp);
        })
        console.log(tempdata)

        let headers=["id","title","location","startdate","enddate"];

        doc.table(12, 87, tempdata, headers,{ fontSize: 10 });
        var saveName="progress_report_"+this.state.currentDate+".pdf";
        doc.save(saveName);
    }
    
}
export default new Report;