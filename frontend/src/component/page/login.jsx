import React from 'react';
import "./css/login.css";
import { Field, Form, Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import { Button } from 'antd';
import axios from 'axios';


const Login = () => {    
    const loginInitialValues = {
        email:"",
        password:""
    }
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    console.log(process.env.REACT_APP_API_URL);

    const loginSubmitHandler = async (values) =>{
        axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
        axios.post(`${process.env.REACT_APP_API_URL}/users/login`, values)
        .then(response => {
            setAuth({user: response.data.user, roles: [response.data.role], token: response.data.token});
            if(response.data.role === 'manager') navigate('/inventory');
            if(response.data.role === 'site') navigate('/track');
            if(response.data.role === 'contractor') navigate('/process');
        }).catch(error => {
            console.error(error);
        }) 
    }
  return (
    <div className='loginPage-holder'>
        <section className="loginForm-holder">
            <Formik
                initialValues={loginInitialValues}
                onSubmit={loginSubmitHandler}
            >
                {()=>{
                    return <Form className='loginForm'>
                        <div className='loginform-row'>
                            <label htmlFor="email">Email</label>
                            <Field
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className='loginform-row'>
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                                id="password"
                            />
                        </div>
                        <div className='loginform-row'>
                            <Button type="primary" htmlType="submit">Login</Button>
                        </div>
                    </Form>
                }}
            </Formik>
        </section>
    </div>
  )
}

export default Login;
