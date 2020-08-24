import React from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner, ButtonGroup, CardDeck } from 'reactstrap';
// import reducers from "../../reducers";

import { connect } from 'react-redux';
import Actions from 'actions';
import TripsCard from "../../components/cards/tripsCard";
import TripDetailsModal from "components/modals/tripDetails";
import EditTripModal from "../../components/modals/editTrip";
import DeleteTripModal from "../../components/modals/deleteTrip";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tripsList: [],
            showPop: false,
            listData: [],
            tripDetailsId: "",
            loading: true,
            openModalDelete: false,
            openModalEdit: false,
            tripData: null,
        };
    }

    componentDidMount() {
        // console.log("DASHBOARD MOUNTED");

        this.props.onGetAll();
    }

    componentDidUpdate(prevProps) {
        // console.log("DASHBOARD UPDATE");
        const { getGetAllData } = this.props;

        console.log("TRIP DATA", getGetAllData.data);


        if (prevProps.getGetAllData.isLoading && !getGetAllData.isLoading) {

            if ( (Object.keys(getGetAllData.data).length !== 0) ) {
                this.setState(
                    {
                        tripsList: getGetAllData.data,
                        loading: false,
                        openModalDelete: false,
                        openModalEdit: false,
                    }
                )
            }
        }
    }

    detailsPressed(id) {
        this.props.history.push({
            pathname: `/dashboard/${id}`,
            state: {
                data: this.state.tripsList.filter( item => item.id === id && item) // filter trip id -> to pass to the details page
                // tripId: id,
            }
        });
    }

    toggle() {

        this.setState({
            showPop: !this.state.showPop,
        });
    }

    closeModal() {
        this.setState({
            openModalEdit: false,
            openModalDelete: false,
        })
    }

    handleShowModal(action, details) {
        // console.log('handleShowModal called', details);
        switch(action) {
            case "EDIT":
              this.setState({
                  openModalEdit: true,
                  tripData: details,
              })
              break;

            case "DELETE":
              this.setState({
                  openModalDelete: true,
                  tripData: details,
              })
              break;            

            default:
              // code block
              console.log("invalid planner category")
              break;
          }
    }

    render() {
        return(
            <> 
                <Container className="themed-container" fluid="xl" style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems:"center", padding: 0, margin: "0 auto"}}>

                            {/*-------------------------Dashboard------------------------------------------------------------------------------------------------- */}
                            <Container className="themed-container" style={{ textAlign:"center", margin: 0, padding: 0}} fluid={true}  >

                                <div style={{margin: 40,}}>
                                    <h1>Your Trips</h1>
                                </div>

                                {/* ------------------------DATE FILTER---------------------------- */}
                                {/* <div style={styles.selectContainer}>
                                    <button style={styles.selectButton}>Upcoming</button>
                                    <button style={styles.selectButton}>Past Trips</button>
                                </div> */}

                                <div style={{margin: 40,}}>
                                <ButtonGroup>
                                    <Button >Upcoming</Button>
                                    <Button >Past Trips</Button>
                                </ButtonGroup>
                                </div>

                                {this.state.loading ? (
                                    
                                <Row style={{height: "40vh", justifyContent: "center", alignItems: "center"}}>
                                
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </Row>) : (

                                <Row style={{justifyContent: "center", alignItems: "center",}}>

                                    {
                                        this.state.tripsList.map( list => (
                                        // <Col xs="2" md="6" lg="5" style={{margin: 10,}}>
                                            <CardDeck style={{margin: 10,}}>

                                                <TripsCard
                                                    tripData={list}
                                                    tripId={list.id}
                                                    tripTitle={list.trip_name}
                                                    tripOrigin={list.origin}
                                                    tripCreatedBy={list.created_by}
                                                    tripStartDate={list.start_date}
                                                    tripEndDate={list.end_date}
                                                    tripTotal={list.total}
                                                    tripUsers={list.users}
                                                    tripBanner={list.trip_banner}
                                                    onClick={() => this.detailsPressed(list.id)}
                                                    handleEdit={ () => this.handleShowModal('EDIT', list)}
                                                    handleDelete={ () => this.handleShowModal('DELETE', list)}
                                                
                                                />
                                            
                                                {/* <div style={styles.buttonContainer}>
                                                    <Button 
                                                        style={{border: "rgba(0,0,0,0.4)"}} // backgroundImage: "linear-gradient(to bottom right, #E74C3C, #B03A2E)"}}
                                                        type="submit"
                                                        color="link"
                                                        // size="sm"
                                                        onClick={() => this.detailsPressed(list.id)}
                                                        block
                                                    >Trip Details</Button>
                                                </div> */}
                                                {/* </Col> */}
                                            </CardDeck>
                                            ) )
                                        }

                                </Row>
                                )}
                            </Container>
                        {/* </Col> */}
                        
                    {/* </Row> */}
                </Container>
                {/* --------------------------------------MODALS FOR CREATE FORMS----------------------------------- */}
                <EditTripModal
                    isOpen={this.state.openModalEdit}
                    toggle={() => this.closeModal()}
                    // destinationId = {this.state.tripId}
                    tripData = {this.state.tripData}
                    handleEdit = { this.props.onUpdateTrip }
                />
                <DeleteTripModal
                    isOpen={this.state.openModalDelete}
                    toggle={() => this.closeModal()}
                    // destinationId = {this.state.tripId}

                    deleteType = "trip"
                    tripData = {this.state.tripData}
                    handleDelete = { () => this.props.onDeleteTrip( {id: this.state.tripData.id} ) }
                />
            </>
        )
    }
}

const styles = {
    columnStyle: {
        // border: "1px solid rgba(0,0,0,0.6)",
        borderRadius: 20,
        minWidth: 400,
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 0,
        margin: 10,
        // overflow: "hidden",
    },
    sidebarBox: {
        border: "2px solid black",
        width: "100%",
        height: 40,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // margin: 10,
        padding: 10,
    },
    selectContainer: {
        // width: "80%",
        // height: 40,
        backgroundColor: "white",
        margin: 20,
        overflow: "hidden",
        borderRadius: 10,
        // border: "1px solid rgba(0,0,0,0.4)",

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    selectButton: {
        backgroundColor: "transparent",
        outline: "none",
        border: "1px solid rgba(0,0,0,0.4)",
        // borderRadius: 10,
        padding: 10,
        color: "black",
        // borderRadius: "50 0 0 0",
    },

    tripContent: {
        minWidth: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 10,
    },
    buttonContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        // backgroundColor: "grey",
        // marginBottom: 5,
        // paddingRight: 20,
        paddingBottom: 10,
        borderTop: "1px solid rgba(0,0,0,0.4)",
    }
}

// get data from api
const mapStateToProps = store => ({
    getGetAllData: Actions.getGetAllData(store),
    // getUserSession: Actions.getUserSession(store),
    // getDeleteTaskData: Actions.getDeleteTaskData(store)
});

// dispatch to action
const mapDispatchToProps = {
    onUpdateTrip: Actions.updateTrip,
    onDeleteTrip: Actions.deleteTrip,
    onGetAll: Actions.getAll,
};

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Dashboard);