import React from 'react'

const UserCard = ({user}) => {
  console.log(user)
  const {firstName, lastName, photoUrl,gender, age, about} = user;
  return (
    <div className="card card-compact bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoUrl}
          alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        <p>{age + "," +gender}</p>
        <p>{about}</p>
        <div className="card-actions justify-center my-4 gap-40">
          <button className="btn btn-secondary">Interested</button>
          <button className="btn btn-primary">Ignore</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard