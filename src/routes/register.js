import React, { useState } from "react";
import { Container, Header, Message, Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const Register = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
  });
  const { username, email, password } = user;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
      register(username: $username, email: $email, password: $password) {
        ok
        errors {
          path
          message
        }
      }
    }
  `;

  const [addUser] = useMutation(registerMutation);
  const handSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addUser({
        variables: { username, email, password },
      });
      if (data !== undefined) {
        const { ok, errors } = data.register;
        if (ok) {
          setUser({
            username: "",
            email: "",
            password: "",
          });
          props.history.push("/");
        } else {
          const err = {};
          errors.forEach(({ path, message }) => {
            err[`${path}Error`] = message;
          });
          setErrorMsg(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { usernameError, emailError, passwordError } = errorMsg;
  const errorList = [];
  if (usernameError) {
    errorList.push(usernameError);
  }
  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }
  return (
    <Container text>
      <Header as="h2">Register</Header>
      <Form onSubmit={handSubmit}>
        <Form.Field error={!!usernameError}>
          <label>Username</label>
          <input
            value={username}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="Username"
          />
        </Form.Field>
        <Form.Field error={!!emailError}>
          <label>Email</label>
          <input
            value={email}
            name="email"
            onChange={handleChange}
            placeholder="Email"
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <label>Password</label>
          <input
            value={password}
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="password"
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
      {usernameError || emailError || passwordError ? (
        <Message
          error
          header="There was some errors with your submission"
          list={errorList}
        />
      ) : null}
    </Container>
  );
};

export default Register;
