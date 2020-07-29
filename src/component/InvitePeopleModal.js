import React from "react";
import { withFormik } from "formik";
import { Modal } from "semantic-ui-react";
import styled from "styled-components";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";
import { gql } from "apollo-boost";
import normalizeError from "../normalizeError";

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

const InvitePeopleModal = ({
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
      <Modal.Header>Add user to your team</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <form onSubmit={handleSubmit}>
            <FormStyle>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter user email..."
              />
              {/* {errors.email && touched.email && (
                <div className="error">{errors.email}</div>
              )} */}
              <div className="buttons">
                <button
                  type="submit"
                  className="submit"
                  disabled={isSubmitting}
                >
                  Add User
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
  mutation($teamId: Int!, $email: String!) {
    addTeamMember(teamId: $teamId, email: $email) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ email: "" }),

    // Custom sync validation
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      }

      return errors;
    },

    handleSubmit: async (
      values,
      { setSubmitting, props: { teamId, mutate, close }, setErrors }
    ) => {
      // console.log(values);
      const res = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = res.data.addTeamMember;
      if (ok) {
        close();
        setSubmitting(false);
      } else {
        console.log(errors);
        setErrors(normalizeError(errors));
        setSubmitting(false);
      }
    },

    // displayName: "BasicForm",
  })
)(InvitePeopleModal);
