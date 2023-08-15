import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "myFirebase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nweetText, setNweetText] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const NweetImageRef = ref(storageService, nweetObj.attachmentUrl);

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
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(NweetTextRef);
      if (nweetObj.attachmentUrl !== "") {
        await deleteObject(NweetImageRef);
      }
    }
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
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="100px" alt="nweet" />
          )}
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
