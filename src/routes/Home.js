import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "myFirebase";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let attachmentUrl = "";
      if (attachment !== "") {
        const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(fileRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(response.ref);
      }
      const nweetObj = {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      };
      await addDoc(collection(dbService, "nweets"), nweetObj);
    } catch (error) {
      console.error("error", error);
    }
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (event) => {
      const {
        currentTarget: { result },
      } = event;
      setAttachment(result);
    };
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapShot) => {
      const nweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          onChange={onChange}
          value={nweet}
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="nweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="이미지" width="300px" height="200px" />
            <button onClick={onClearAttachment}>Cancle Upload</button>
          </div>
        )}
      </form>
      {nweets.map((value) => {
        return (
          <Nweet
            key={value.id}
            nweetObj={value}
            isOwner={value.creatorId === userObj.uid}
          />
        );
      })}
    </div>
  );
};

export default Home;
