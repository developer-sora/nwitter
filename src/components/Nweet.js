import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nweetText, setNweetText] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweetText(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, {
      text: nweetText,
    });
    setIsEditing(false);
  };

  const onDeleteClick = async () => {
    await deleteDoc(NweetTextRef);
  };

  return (
    <div>
      {isEditing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  value={nweetText}
                  required
                  placeholder="Edit nweet"
                  onChange={onChange}
                />
                <input type="submit" value="Edit" />
              </form>
              <button onClick={toggleEdit}>Cancel</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={toggleEdit}>Edit</button>
              <button onClick={onDeleteClick}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
