import React from "react";
import { extendObservable } from "mobx";
import { observer } from "mobx-react";
import { Message, Container, Header, Button, Form } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

class Login extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: "",
      password: "",
      errors: {},
    });
  }
  handSubmit = async () => {
    const { email, password } = this;
    const res = await this.props.mutate({
      variables: { email, password },
    });
    const { ok, token, refreshToken, errors } = res.data.login;
    if (ok) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      this.props.history.push("/");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = err;
    }
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  };

  render() {
    const {
      email,
      password,
      errors: { emailError, passwordError },
    } = this;
    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form onSubmit={this.handSubmit}>
          <Form.Field error={!!emailError}>
            <label>Email</label>
            <input
              value={email}
              name="email"
              onChange={this.handleChange}
              placeholder="Email"
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <label>Password</label>
            <input
              value={password}
              name="password"
              onChange={this.handleChange}
              type="password"
              placeholder="password"
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
        {errorList.length ? (
          <Message
            error
            header="There was some errors with your submission"
            list={errorList}
          />
        ) : null}
      </Container>
    );
  }
}
const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(loginMutation)(observer(Login));
