import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './graph.css'
import Dropzone from 'react-dropzone'
import { projectActions } from '../_actions';
import classNames from 'classnames'
import TreeView from 'deni-react-treeview';
import 'react-table/react-table.css'
import {Line} from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router";
import CardActionArea from "../IndexPage/IndexPage";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        paddingBottom: 200,
        paddingTop: 50,
    },
    grid: {
        width: 1200,
        justifyContent: 'start',
        margin: `0 ${theme.spacing.unit * 2}px`,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    loadingState: {
        opacity: 0.05
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    treeView: {
        width: '100%',
        border: 0,
        height: 150,
        backgroundColor: '#FFF',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '0.875rem',
        fontFamily: "Roboto"
    },
    button: {
        margin: theme.spacing.unit,
        width: '80%'
    },
    upload: {
        marginLeft: '-8px'
    },
    datasetContainer:{
      maxHeight: '50vh',
      overflowY: 'scroll'
    },
    tablecontainer:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > table': {
            border: '1px solid',
            padding: 0,
            width: '75%',
            background: '#f5f5f5',
            '& > tr': {
                padding: 0,
                '& > th':{
                    background: '#4caf50',
                    margin: 7,
                    color: "#FFF",
                    textAlign: "center",
                    font: "bold 12pt roboto",
                    padding: 7
                },
                '& > td': {
                    font: "500 13px roboto",
                    margin: 7,
                    fontWeight: 'bold',
                    color: '#000',
                    padding: 4
                }
            }
        }
    }
});


class GraphPage extends React.Component {
    constructor(props){
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onSelectDataset = this.onSelectDataset.bind(this);
        this.state = {
            selected : -1,
        }
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({
            project_id: id,
        });
        this.props.dispatch(projectActions.getProject(id));
        this.props.dispatch(projectActions.getDeployedModel(id));
    }


    onDrop(files){
       for(let file of files) {
           var data = new FormData();
           data.append('file_url', file);
           data.append('project', this.state.project_id);
           this.props.dispatch(projectActions.addDataset(data, this.state.project_id));
       }
    }

    handleChange(files) {
        console.log('files', files);
    }

    onSelectDataset(e){
        if(this.state.selected != e.id)
                this.setState({
                    selected: e.id
                });
    }

    componentWillReceiveProps(nextProps) {
        let {groups} = this.props;
        let nextGroups = nextProps.groups;
        if (groups.project != nextGroups.project) {
            this.props.dispatch(projectActions.clearState());
            var sets = [];
            for (let set of nextGroups.project.datasets) {
                sets.push({
                    id: set.id,
                    text: set.name,
                    isLeaf: true
                })
                this.props.dispatch(projectActions.getDatasetMeta({id: set.id, name: set.name}))
            }
            this.setState({
                datasets: [{
                    id: -1,
                    text: 'Datasets',
                    children: sets
                }]
            })
        }
    }

    render() {
        const { groups, classes } = this.props;

        const prediction_data = {
            labels: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7'],
            datasets: [
                {
                    label: 'Actual',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 0.01,
                    data: [0.1, 0.5, 0.3, 0.3, 0.1, 0.6, 0.3]
                },
                {
                    label: 'Prediction',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 0.01,
                    data: [0.1, 0.2, 0.3, 0.4, 0.2, 0.1, 0.0]
                }
            ]
        };


        return (
            <div className={classes.root}>
                <Grid container justify="center">
                    <Grid spacing={24} alignItems="start" justify="center" container className={classes.grid}>
                        <Grid item xs={3}>
                            {/*
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom>Datasets</Typography>
                                <TreeView className={classes.treeView} items={ this.state.datasets } onSelectItem={this.onSelectDataset}/>
                            </Paper>
                            <br/>
                                */}
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom>Model name</Typography>
                                {   groups.deployed && groups.deployed.length > 0 &&
                                    <Typography variant="body2" gutterBottom>{groups.deployed[0].model_d.name}</Typography>
                                }
                                <br/>
                                <Typography variant="h6" gutterBottom>Prediction variable</Typography>
                                {   groups.deployed && groups.deployed.length > 0 &&
                                    <Typography variant="body2" gutterBottom>{groups.deployed[0].model_d.training.y_yariable_d.column_name}</Typography>
                                }
                                <br/>
                                <Typography variant="h6" gutterBottom>Prediction variable</Typography>
                                {   groups.deployed && groups.deployed.length > 0 &&
                                <Typography variant="body2" gutterBottom>{groups.deployed[0].model_d.training.time_yariable_d.column_name}</Typography>
                                }
                                <br/>
                                <Button  onClick={(e)=> {this.props.history.push('/training/'+this.state.project_id)}} variant="contained" color="primary" className={classes.button}>
                                    View model data
                                </Button>
                                <br/>
                                <Button onClick={(e)=> {this.props.history.push('/dashboard/'+this.state.project_id)}} variant="contained" color="primary" className={classes.button}>
                                    View data schema
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper className={[classes.paper, classes.datasetContainer]}>
                                <Typography variant="h6" gutterBottom>Datasets</Typography>
                                <br/>
                                <Grid container justify="center">
                                    {
                                        groups.metas && groups.metas.length > 0 && groups.metas.map((row, index) => (
                                            <Grid item xs={4} alignItems='center' className={classes.tablecontainer} key={index}>
                                                <table className={classes.table}>
                                                    <tr>
                                                        <th>{row.dataset.name.split('.')[0]}</th>
                                                    </tr>
                                                    {
                                                        row.meta.map((obj) => (
                                                            <tr key={obj.id}>
                                                                <td>{obj.column_name}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </table>
                                                <br/>
                                                <Button size="small" color="primary" className={classes.button}>
                                                    Upload testing set
                                                </Button>
                                            </Grid>
                                        ))
                                    }

                                </Grid>
                                <br/>
                                {
                                    this.state.selected!=-1 &&
                                    groups.project.datasets.map((obj) =>
                                        this.state.selected == obj.id &&
                                        <React.Fragment key={obj.id}>
                                                <Typography variant="subtitle2" gutterBottom>Dataset name</Typography>
                                                <Typography variant="body2" gutterBottom>{obj.name}</Typography>
                                                <br/>
                                                <Grid container>
                                                    <Grid item sm={6}>
                                                        <Typography variant="subtitle2" gutterBottom>No of rows</Typography>
                                                        <Typography variant="body2" gutterBottom>{obj.rows}</Typography>
                                                    </Grid>
                                                    <Grid item sm={6}>
                                                        <Typography variant="subtitle2" gutterBottom>No of columns</Typography>
                                                        <Typography variant="body2" gutterBottom>{obj.rows}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <br/>
                                                <Button size="small" color="primary" className={classes.upload}>
                                                    Upload testing set
                                                </Button>
                                        </React.Fragment>
                                    )
                                }
                            </Paper>
                            <br/>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom>Prediction</Typography>
                                <Line data={prediction_data} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>


                    /*
            <div className="row">
                <div className="col-md-3 col-sm-4">
                    <div className="card-container" style={{height: '100vh'}}>
                        <h3 style={{textAlign: 'center'}}>Model details</h3>
                        <div className="data-inner-container">
                            <h4>Model Name</h4>
                            <p>Neural network</p>
                        </div>
                        <div className="data-inner-container">
                            <h4>Model Accuracy</h4>
                            <p>89%</p>
                        </div>
                        <div className="data-inner-container">
                            <h4>Prediction variable</h4>
                            <p>Sales</p>
                        </div>

                        <div style={{textAlign: 'center'}}>
                            <Link style={{margin: '10px 0'}} className="btn btn-default" to={'/training/'+this.state.project_id}>View model details</Link>
                            <br/>
                            <Link className="btn btn-default" to={'/dashboard/'+this.state.project_id}>View data schema</Link>
                        </div>

                    </div>
                </div>
                <div className="col-md-9 col-sm-8">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card-container h-40">
                                <div className="col-md-3 col-sm-4 treeview-container">
                                    <TreeView items={ this.state.datasets } style={{height: '35vh'}} onSelectItem={this.onSelectDataset}/>
                                </div>
                                {
                                    this.state.selected!=-1 &&
                                    groups.project.datasets.map((obj) =>
                                        this.state.selected == obj.id &&
                                        <div key={obj.id} style={{'padding': '10px'}} className="col-md-9 col-sm-8">
                                            <span style={{fontWeight: 'bold'}}>Dataset name:</span> {obj.name}<br/>
                                            <span style={{fontWeight: 'bold'}}>No of rows:</span> {obj.rows}<br/>
                                            <span style={{fontWeight: 'bold'}}>Status:</span> {obj.status}<br/>
                                            <span style={{fontWeight: 'bold'}}>Updated at:</span> {new Date(obj.updated_at).toDateString()}<br/>
                                            <a href={obj.file_url} target="_blank">View dataset</a><br/>
                                            <p style={{margin: '10px 0 0 0', fontWeight: 'bold'}}>Upload again</p>
                                            <input type="file" onChange={ (e) => this.handleChange(e.target.files) }/>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card-container h-60">

                                <div className="row">
                                    <div className="col-md-12">
                                        <h3>Predictions</h3>
                                        <Line data={prediction_data} />
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
                */
        );
    }
}

function mapStateToProps(state) {
    const { groups, authentication } = state;
    const { user } = authentication;
    return {
        user,
        groups
    };
}

const connectedGraphPage = withRouter(withStyles(styles)(connect(mapStateToProps)(GraphPage)));
export { connectedGraphPage as GraphPage };