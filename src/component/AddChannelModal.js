import React from "react";
import { withFormik } from "formik";
import { Modal } from "semantic-ui-react";
import styled from "styled-components";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { gql } from "apollo-boost";
import { allTeamsQuery } from "../graphql/team";
import findIndex from "lodash/findIndex";

const FormStyle = styled.div`
  padding: 10px 20px;
  input {
    display: block;
    padding: 15px 5px;
    width: 100%;
    outline: none;
    border: 1px solid #eeeeee;
    border-radius: 5px;
  }
  .buttons {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
  }
  button {
    width: 100%;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    outline: none;
  }
  button:active {
    cursor: pointer;
  }
  .submit {
    color: #ffffff;
    background-color: green;
    margin-right: 10px;
  }
  .error {
    color: red;
    margin: 10px 0;
  }
`;

const AddChannelModal = ({
  open,
  close,
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <Modal open={open} onClose={close}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <form onSubmit={handleSubmit}>
            <FormStyle>
              <input
                name="name"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                placeholder="Enter channel name..."
              />
              {errors.name && touched.name && (
                <div className="error">{errors.name}</div>
              )}
              <div className="buttons">
                <button
                  type="submit"
                  className="submit"
                  disabled={isSubmitting}
                >
                  Add Channel
                </button>
                <button
                  className="cancel"
                  onClick={close}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </FormStyle>
          </form>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: "" }),

    // Custom sync validation
    validate: (values) => {
      const errors = {};

      if (values.name.length < 3) {
        errors.name = "Channel name must be at least 3 characters";
      }

      return errors;
    },

    handleSubmit: async (
      values,
      { setSubmitting, props: { teamId, mutate, close } }
    ) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          createChannel: {
            __typename: "Mutation",
            ok: true,
            channel: {
              __typename: "Channel",
              id: -1,
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }

          const data = store.readQuery({ query: allTeamsQuery });
          const teamIdx = findIndex(data.allTeams, ["id", teamId]);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({ query: allTeamsQuery, data });
        },
      });
      close();
      setSubmitting(false);
    },

    // displayName: "BasicForm",
  })
)(AddChannelModal);
