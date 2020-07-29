import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const getAllUsers = gql`
  {
    allUsers {
      id
      email
      username
    }
  }
`;

const Home = () => {
  const { error, loading, data } = useQuery(getAllUsers);
  // console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.allUsers.map(({ id, username, email }) => (
    <div key={id}>
      {/* <p>Username: {username}</p> */}
      <p>Email: {email}</p>
    </div>
  ));
};

export default Home;
