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

import * as React from 'react';
import { Link } from "react-router-dom";
import cogoToast from "cogo-toast";

import ScheduleDataService from "./../../../services/schedule.service";
import MeetingDataService from "./../../../services/project_management/meeting.service";
import AuthService from "./../../../services/auth.service";

import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {
  Scheduler,
  DayView,
  MonthView,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  AllDayPanel,
  Toolbar,
  ViewSwitcher,
  TodayButton,
  DateNavigator,
  ConfirmationDialog,
  EditRecurrenceMenu,
} from '@devexpress/dx-react-scheduler-material-ui';

//const appointments = [
//  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
//  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
//  { title: 'Mail New Leads for Follow Up', startDate: '2018-11-01T13:30' },
//];

const useStyles = makeStyles(theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
}));

const TimeTableCell = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...props} />;
};

const day = new Date();

//Customize the Appearance
const Appointment = ({
  children, style, ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#273f7d',
      borderRadius: '8px',
    }}
  >
    {children}
  </Appointments.Appointment>
);

export default class Schedule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data1: [],
      currentDate: day,
      userId: AuthService.getCurrentUser().id,
      id: this.props.match.params.id,


      addedAppointment: {},
      appointmentChanges: {},
      editingAppointment: undefined,
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
    this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
    this.retrieveAppointments = this.retrieveAppointments.bind(this);
    this.retrieveMeetings = this.retrieveMeetings.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser().id;
    this.retrieveAppointments(user);
    this.retrieveMeetings(this.props.match.params.id);
  }

  retrieveMeetings(id) {
    MeetingDataService.getMeetings(id)
      .then(response => {
        this.setState({
          data1: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveAppointments(id) {
    ScheduleDataService.getAll(id)
      .then(response => {
        this.setState({
          data: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointment(editingAppointment) {
    this.setState({ editingAppointment });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      //add task to schedule 
      if (added) {
        //  const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        //  data = [...data, { id: startingAddedId, ...added }];

        //console.log(added.title)

        var dataSend = {
          title: added.title,
          startDate: added.startDate,
          endDate: added.endDate,
          userId: AuthService.getCurrentUser().id,
        };

        ScheduleDataService.create(dataSend)
          .then(response => {
            this.setState({
              title: response.dataSend.title,
              startDate: response.dataSend.startDate,
              endDate: response.dataSend.endDate,
              userId: response.dataSend.userId,
            });
            console.log(response.data);
            window.location.reload();
            cogoToast.success("Task added successfully!");
          })
          .catch(e => {
            console.log(e);
          });
        window.location.reload();
      }

      //update a schedule 
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
        console.log(changed)
        cogoToast.success("Task updated successfully!");

      }
      //delete a schedule 
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);

        ScheduleDataService.delete(deleted)
          .then(response => {
            console.log(response.data);
            window.location.reload();
            // this.props.history.push('/drawings/'+this.state.pid);
            cogoToast.success("Task deleted successfully!");
          })
          .catch(e => {
            console.log(e);
          });

        console.log("schedule deleted")
      }
      return { data };
    });
  }

  render() {
    const { currentDate, data, addedAppointment, appointmentChanges, editingAppointment, id } = this.state;

    return (

      <div>
        <div className="row">
          <div className="col" >
            <h2>SCHEDULE</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/" + id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/schedule/" + id} aria-current="page">
                Schedule
              </Link>
            </Breadcrumbs>
          </div>
        </div>
        <hr />
        <br />
        <Paper>
          <Scheduler
            data={data}
          >
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={this.currentDateChange}
              defaultCurrentViewName="Week"
            />

            <EditingState
              onCommitChanges={this.commitChanges}
              addedAppointment={addedAppointment}
              onAddedAppointmentChange={this.changeAddedAppointment}
              appointmentChanges={appointmentChanges}
              onAppointmentChangesChange={this.changeAppointmentChanges}
              editingAppointment={editingAppointment}
              onEditingAppointmentChange={this.changeEditingAppointment}
            />
            <IntegratedEditing />

            <DayView
              startDayHour={0}
              endDayHour={24}
            />

            <WeekView
              startDayHour={0}
              endDayHour={24}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
            />

            <MonthView />

            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <AllDayPanel />
            <EditRecurrenceMenu />
            <ConfirmationDialog />
            <Appointments
              appointmentComponent={Appointment}
            />
            <AppointmentTooltip
              showCloseButton
              showOpenButton
              showDeleteButton
            />
            <AppointmentForm />
          </Scheduler>
        </Paper>
      </div>
    );
  }
}