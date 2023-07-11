import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addMyEvent, deleteMyEvent, updateMyEvent } from "../Store/reducer";
import "./UpdateModel.css";
const UpdateModel = ({ addAndUpdateEvent, closeModel, isAddEvent }) => {
  const { title, desc, id, start, end } = addAndUpdateEvent;
  const [show, setShow] = useState(true);
  const [eventTitle, setEventTitle] = useState(title);
  const [description, setDescription] = useState(desc);
  const [startTime, setStartTime] = useState(start.toLocaleTimeString());
  const [endTime, setEndTime] = useState(end.toLocaleTimeString());
  const [errorMsg, setErrorMsg] = useState("");
  console.log(start);
  console.log(end)
  console.log(endTime);
  console.log(addAndUpdateEvent);

  const dispatch = useDispatch();
  const modalClose = () => {
    closeModel();
    setShow(false);
  };

  const showErrorMsg = (trimmedEventTitle) => {
    if (trimmedEventTitle === "") {
      setErrorMsg("please enter valid title");
    }
  };

  const titleInputChanged = (event) => {
    const { value } = event.target;
    setEventTitle(value);
    setErrorMsg("");
  };
  const descriptionChanged = (event) => {
    const { value } = event.target;
    setDescription(value);
    setErrorMsg("");
  };
  const onStartTimeChange = (event) => {
    const { value } = event.target;
    setStartTime(value);
  };
  const onEndTimeChange = (event) => {
    const { value } = event.target;
    setEndTime(value);
  };

  const modalCloseOnAdd = (event) => {
    event.preventDefault();
    const trimmedEventTitle = eventTitle.trim();
    const trimmedDescription = description.trim();

    const endYear = end.getFullYear();
    let endMonth = end.getMonth();
    let endDate = end.getDate();
    console.log(typeof endDate)
    let daysInMonth = moment(start).daysInMonth()
    console.log(daysInMonth)
    console.log(start.getTime() - end.getTime())
    if (end.getTime() - start.getTime() === 86400000)
    // (end.toLocaleTimeString() === "00:00:00" || end.toLocaleTimeString() === "12:00:00 AM") && start.getDate() !== endDate) 
    {
      // if (endDate === 31 && (endMonth % 2 === 1 || endMonth === 8 || endMonth === 10 || endMonth === 12)) {
      //   console.log(31)
      //   endDate = start.getDate();
      // }
      // else if (endDate === 30 && (endMonth % 2 === 0 || endMonth === 9 || endMonth === 11)) {
      //   console.log(30)
      //   endDate = start.getDate()
      // }
      if (daysInMonth === start.getDate()) {
        endDate = start.getDate()
        endMonth = endMonth - 1
      }
      else {
        endDate = endDate - 1
      }
    }
    console.log(endYear, endMonth, endDate);

    if (trimmedEventTitle) {
      let AddOrUpdateEventDetails = {
        id: id,
        title: trimmedEventTitle,
        desc: trimmedDescription,
        start: new Date(`${moment(start).format("ll")} ${startTime}`),
        end: new Date(`${endYear}/${endMonth + 1}/${endDate} ${endTime}`),
      };
      console.log(AddOrUpdateEventDetails.start)
      console.log(AddOrUpdateEventDetails.end)
      if (AddOrUpdateEventDetails.start.getTime() >= AddOrUpdateEventDetails.end.getTime()) {
        alert("Please set valid End Time")
        return
      }
      isAddEvent
        ? dispatch(addMyEvent(AddOrUpdateEventDetails))
        : dispatch(updateMyEvent(AddOrUpdateEventDetails));
      setShow(false);
      closeModel();
    } else {
      showErrorMsg(trimmedEventTitle);
    }
  };

  const deleteEvent = () => {
    const id = addAndUpdateEvent.id;
    closeModel();
    dispatch(deleteMyEvent(id));
  };

  return (
    <>
      <Modal centered show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isAddEvent ? "Add Event" : "Update Event"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="form-container" onSubmit={modalCloseOnAdd}>
            <label className="label" htmlFor="eventTitle">
              Event Title
            </label>
            <input
              className="input"
              type="text"
              id="eventTitle"
              placeholder="Event Title"
              maxLength="40"
              value={eventTitle}
              onChange={titleInputChanged}
              autoFocus
            />
            <label className="label" htmlFor="textarea">
              Description
            </label>
            <textarea
              className="textarea"
              // eslint-disable-next-line react/no-unknown-property
              row="5"
              maxLength="200"
              placeholder="Description"
              value={description}
              onChange={descriptionChanged}
              id="textarea"
            ></textarea>
            <div>
              <label className="time-label" htmlFor="StartTime">
                Start:
              </label>
              <input
                type="time"
                id="startTime"
                className="time"
                value={startTime}
                onChange={onStartTimeChange}
              />

              <label className="time-label" htmlFor="endTime">
                End:
              </label>
              <input
                type="time"
                id="endTime"
                className="time"
                value={endTime}
                onChange={onEndTimeChange}
              />
            </div>
            {errorMsg && (
              <p className="error-msg">
                <sup>*</sup>
                {errorMsg}
              </p>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close Event
          </Button>
          {!isAddEvent && (
            <Button variant="danger" onClick={deleteEvent}>
              Delete Event
            </Button>
          )}
          <Button variant="primary" onClick={modalCloseOnAdd}>
            {isAddEvent ? "Add Event" : "Update Event"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateModel;
