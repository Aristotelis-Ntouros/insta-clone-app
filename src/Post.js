import React, { useEffect, useState } from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';


function Post( { user, postId, username, caption, imageUrl } ) {  // pass the exact prop info
    const [comments, setComments] = useState ([]);
    const [comment, setComment] = useState ('');


    useEffect (() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection('+')
            .doc(postId) 
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        }
    },   [postId]);      // if that variable changes IT REFIRES (DEPENDANCY)

        const postComment = (event) => {
            event.preventDefault();

            db.collection('+').doc(postId).collection("comments").add({
             text: comment,
             username: user.displayName ,
             timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setComment('');
        }
    
    return (
        <div className="post">
            <div className="post-header">
            <Avatar
            className="post-avatar" 
            alt= "Telis"
            src="/static/images/avatar/1.jpg">
            </Avatar>
            <h3>{username}</h3>
            </div>

            <img className="post-img" src={imageUrl} alt=""/>

            <h4 className="post-text"><strong>{username}</strong>{caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                    <strong>{comment.username} </strong>{comment.text}
                    </p>    
                ))
                }    
            </div>

            {user && (
                  <form className="post__commentBox">
                  <input 
                  type="text"
                  className="post__input"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  />
                  <button 
                      className="post__button"
                      disabled={!comment}
                      type="submit"
                      onClick={postComment}
                   >
                   Post
                   </button>
              </form>

            )}

          

        </div>
    )
}

export default Post
