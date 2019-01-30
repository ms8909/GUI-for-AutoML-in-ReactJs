import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { userActions } from '../_actions';
import * as Yup from 'yup';


class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                full_name: '',
                email: '',
                phone: '',
                address: '',
                password1: '',
                password2: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    // handleSubmit(event) {
    //     event.preventDefault();
    //
    //     this.setState({ submitted: true });
    //     const { user } = this.state;
    //     const { dispatch } = this.props;
    //     if (user.full_name && user.email && user.phone && user.address && user.password1 && user.password2) {
    //         dispatch(userActions.register(user));
    //     }
    // }


    handleSubmit(values, { setSubmitting }) {
        const { dispatch } = this.props;
        dispatch(userActions.register(values));
        setSubmitting(false)
    }

    render() {
        const { registering  } = this.props;
        const { user, submitted } = this.state;
        const signupValidationSchema = Yup.object().shape({
            first_name: Yup.string()
                .required('First name is required'),
            last_name: Yup.string()
                .required('Last name is required'),
            company_name: Yup.string()
                .required('Company name is required'),
            email: Yup.string()
                .email('Invalid email format')
                .required('Email address is required'),
            password: Yup.string()
                .required('Password is required'),
            confirm: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Confirm password is required'),
        });


        const form = <Formik
            initialValues={{ first_name: '', last_name: '', company_name: '', email: '', password: '', confirm:'' }}
            validationSchema={signupValidationSchema}
            onSubmit={this.handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className="form-group">
                        <label htmlFor="first_name">First name</label>
                        <Field type="text" className="form-control" name="first_name" />
                        <ErrorMessage name="first_name" className="help-block" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last name</label>
                        <Field type="text" className="form-control" name="last_name" />
                        <ErrorMessage name="last_name" className="help-block" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company_email">Company name</label>
                        <Field type="text" className="form-control" name="company_name" />
                        <ErrorMessage name="company_name" className="help-block" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field type="text" className="form-control" name="email" />
                        <ErrorMessage name="email" className="help-block" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field type="password" className="form-control" name="password" />
                        <ErrorMessage name="password" className="help-block" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Confirm password</label>
                        <Field type="password" className="form-control" name="confirm" />
                        <ErrorMessage name="confirm" className="help-block" component="div" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>;


        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Register</h2>
                {form}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { registering } = state.registration;
    return {
        registering
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as RegisterPage };