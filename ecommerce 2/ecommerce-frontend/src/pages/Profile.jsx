function Profile() {

  const email =
    localStorage.getItem("email");

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginTop: "40px",
      }}
    >
      <h1>My Profile</h1>

      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
}

export default Profile;
