import React from "react";
import { extendObservable } from "mobx";
import { observer } from "mobx-react";
import { Message, Container, Header, Button, Form } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: "",
      errors: {},
    });
  }
  handSubmit = async () => {
    const { name } = this;
    let res = null;
    try {
      res = await this.props.mutate({
        variables: { name },
      });
    } catch (err) {
      console.log(err);
      this.props.history.push("/login");
      return;
    }

    const { ok, errors, team } = res.data.createTeam;
    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
      return;
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
      name,
      errors: { nameError },
    } = this;
    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Container text>
        <Header as="h2">Create a Team</Header>
        <Form onSubmit={this.handSubmit}>
          <Form.Field error={!!nameError}>
            <label>Name</label>
            <input
              value={name}
              name="name"
              onChange={this.handleChange}
              placeholder="Name"
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
const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(createTeamMutation)(observer(CreateTeam));
