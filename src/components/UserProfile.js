import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState([]);
  const S3_API_URL = "http://localhost:8080/api/s3/profile/";

  const fetchUserProfile = () => {
    axios.get(S3_API_URL).then((res) => {
      setUserProfile(res.data);
    });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  function MyDropzone({ userProfileId }) {
    const onDrop = useCallback(
      (acceptedFiles) => {
        // Do something with the files
        const file = acceptedFiles[0];
        console.log(file);
        const formData = new FormData();
        formData.append("file", file);

        axios
          .post(S3_API_URL + `${userProfileId}/image/post`, formData, {
            header: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            console.log("success");
            window.location.reload(true);
          })
          .catch((error) => {
            console.log(error);
          });
      },
      [userProfileId]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Click here to select your image
          </p>
        )}
      </div>
    );
  }

  return userProfile.map((i, j) => {
    return (
      <div key={j}>
        <hr />
        {i.userProfileId ? (
          <img
            alt={i.userProfileId}
            className="img-format"
            src={S3_API_URL + `${i.userProfileId}/image/download`}
          />
        ) : null}

        <h3>Spring Boot UserName: {i.username}</h3>
        <h3>Spring Boot Profile ID: {i.userProfileId}</h3>
        <MyDropzone userProfileId={i.userProfileId} />
        <hr />
        <br/>
      </div>
    );
  });
};

export default UserProfile;
