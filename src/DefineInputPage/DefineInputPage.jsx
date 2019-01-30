import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {projectActions, userActions} from '../_actions';

import DateTimePicker from 'react-datetime-picker';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withRouter } from "react-router";

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
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    error: {
        color: theme.palette.error.main
    },
    formControl: {
        margin: `${theme.spacing.unit}px 0`,
        minWidth: '100%',
    },
    button: {
        marginTop: '2rem'
    }
});

class DefineInputPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({
            project_id: id,
        });
        if(this.props.groups.selected_dataset == undefined){
            this.props.history.push('/dashboard/'+id);
            return
        }this.props.dispatch(projectActions.getDatasetMeta({id: this.props.groups.selected_dataset, name: ''}))
        this.props.dispatch(projectActions.getProblemType());
        this.props.dispatch(projectActions.getTimeType());
    }

    render() {
        const { groups, classes  } = this.props;
        const { group, submitted } = this.state;

        const meta_options = [
            {id: 0, name: 'Sales'},
            {id: 1, name: 'Time'}
        ];

        const problem_options = [
            {id: 0, name: 'Forecast'},
            {id: 1, name: 'Prediction'}
        ];

        const DefineInputValidationSchema = Yup.object().shape({
            y_yariable: Yup.string()
                .required('Y yariable is required'),
            time_yariable: Yup.string()
                .required('Time yariable is required'),
            problem_type: Yup.string()
                .required('Problem type is required'),
            time_type: Yup.string()
                .required('Time type is required'),
        });

        const form = <Formik
            initialValues={{ y_yariable: '', time_yariable: '', problem_type: '', time_type: '' }}
            validationSchema={DefineInputValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
                values.project = this.state.project_id;
                values.processed_file = groups.selected_dataset;

                let selected = [];
                for(let col of this.props.groups.selected_metas){
                    selected.push(col.column_name);
                }
                values.selected = selected;
                this.props.dispatch(projectActions.createTraining(values, this.state.project_id));
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, values, errors, touched, handleChange }) => (
                <Form>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="y_variable">What do you want to predict?</InputLabel>
                        <Select
                            onChange={handleChange}
                            value={values.y_yariable}
                            inputProps={{
                                name: 'y_yariable',
                            }}
                        >
                            {groups.selected_metas && groups.selected_metas.map((obj) =>
                                        <MenuItem key={obj.id} value={obj.id}>{obj.column_name}</MenuItem>

                            )}
                        </Select>
                        {errors.y_yariable && touched.y_yariable &&
                            <FormHelperText className={classes.error}>{errors.y_yariable}</FormHelperText>
                        }
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="problem_type">What is the problem type?</InputLabel>
                        <Select
                            onChange={handleChange}
                            value={values.problem_type}
                            inputProps={{
                                name: 'problem_type',
                            }}
                        >
                            {groups.problem_type && groups.problem_type.map((obj) =>
                                <MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>
                            )}
                        </Select>
                        {errors.problem_type && touched.problem_type &&
                        <FormHelperText className={classes.error}>{errors.problem_type}</FormHelperText>
                        }
                    </FormControl>


                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="time_variable">What is your time variable</InputLabel>
                        <Select
                            onChange={handleChange}
                            value={values.time_yariable}
                            inputProps={{
                                name: 'time_yariable',
                            }}
                        >
                            {groups.selected_metas && groups.selected_metas.map((obj) =>
                                <MenuItem key={obj.id} value={obj.id}>{obj.column_name}</MenuItem>

                            )}
                        </Select>
                        {errors.time_yariable && touched.time_yariable &&
                            <FormHelperText className={classes.error}>{errors.time_yariable}</FormHelperText>
                        }
                    </FormControl>


                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="time_type">What is the time type?</InputLabel>
                        <Select
                            onChange={handleChange}
                            value={values.time_type}
                            inputProps={{
                                name: 'time_type',
                            }}
                        >
                            {groups.time_type && groups.time_type.map((obj) =>
                                <MenuItem key={obj.id} value={obj.id}>{obj.format}</MenuItem>
                            )}
                        </Select>
                        {errors.time_type && touched.time_type &&
                            <FormHelperText className={classes.error}>{errors.time_type}</FormHelperText>
                        }
                    </FormControl>

                    {/*
                    <div className="form-group form-container">
                        <label htmlFor="first_name">What do you want to predict?</label>


                        <Field component="select" className="form-control" name="y_yariable">
                            <option>Select option</option>
                            {
                                groups.problem_type && groups.problem_type.length > 0 && groups.problem_type.map((obj) =>
                                    <option key={obj.id} value={obj.id}>{obj.column_name}</option>
                                )
                            }
                        </Field>
                        <ErrorMessage name="y_yariable" className="help-block" component="div" />
                    </div>

                    <div className="form-group form-container">
                        <label htmlFor="first_name">What is your problem type?</label>
                        <Field component="select" className="form-control" name="problem_type">
                            <option>Select option</option>
                            {
                                groups.problem_type  && groups.problem_type.map((obj) =>
                                    <option key={obj.id} value={obj.id}>{obj.name}</option>
                                )
                            }
                        </Field>
                        <ErrorMessage name="problem_type" className="help-block" component="div" />
                    </div>

                    <div className="form-group form-container">
                        <label htmlFor="first_name">What is your time yariable?</label>
                        <Field component="select" className="form-control" name="time_yariable">
                            <option>Select option</option>
                            {
                                groups.metas && groups.metas.length > 0 && groups.metas[0].meta.map((obj) =>
                                    <option key={obj.id} value={obj.id}>{obj.column_name}</option>
                                )
                            }
                        </Field>
                        <ErrorMessage name="time_yariable" className="help-block" component="div" />
                    </div>

                    */}

                    <br/>
                    <Button type="submit" variant="contained" color="primary" className={classes.button} disabled={isSubmitting}>
                        Start training
                    </Button>

                    {/*
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            Start training
                        </button>
                    */}
                </Form>
            )}
        </Formik>;



        return (

            <div className={classes.root}>
                <Grid container justify="center">
                    <Grid spacing={24} alignItems="start" justify="center" container className={classes.grid}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom>Define Inputs</Typography>
                                <br/>
                                {form}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        /*
            <React.Fragment>
            <div className="col-md-6 col-md-offset-3">
                <h2>Define Inputs</h2>
                {form}
            </div>
            </React.Fragment>

            */
        );
    }
}

function mapStateToProps(state) {
    const { groups } = state;
    return {
        groups
    };
}

const connectedDefineInputPage = withRouter(withStyles(styles)(connect(mapStateToProps)(DefineInputPage)));
export { connectedDefineInputPage as DefineInputPage };