import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from "./Post";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { db, auth } from './firebase';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles ();
  const [modalStyle] = useState (getModalStyle);
  const [posts, setPosts] = useState ([]);
  const [open, setOpen] = useState (false);
  const [openSingIn, setOpenSignIn] = useState (false);
  const [username, setUsername] = useState ('');
  const [password, setPassword] = useState ('');
  const [email, setEmail] = useState ('');
  const [user, setUser] = useState(null);

  useEffect (() => {
     const unsubscribe = auth.onAuthStateChanged ((authUser) => {
        if(authUser){
        // user has logged in 
        console.log(authUser);
        setUser(authUser)
        } else {
          // user has logged out
          setUser(null);
        }
        })  
      
      return () => {
        // perfmorming some cleaning up actions 
        unsubscribe();
      }

  }, [user, username]);


  useEffect (() => {                  // -> runs a piece of code based on a specific condition 
                       //this is where the code runs
     db.collection('+').onSnapshot(snapshot => {
       setPosts(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
        }))) // here is when the post udpate as soon as the component loads
     })  
  }, []);

  const signUp = (event) => {
      event.preventDefault();
      
      
      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile ({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = (event) =>  {
    event.preventDefault(); // this is for not refreshing

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false); 
  }

  return (
    <div className="app">
      <Modal
      open={open}
      onClose={() => setOpen (false)}
          >
        <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
                <center>
                  <img 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" 
                  className="app-headerImage"
                  />
                </center>
                  <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)
                  }>
                  </Input>
                  <Input
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)
                  }>
                  </Input>
                  <Input
                  type="pasword"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)
                  }>
                  </Input>

               
                <Button type="submit" onClick={signUp}>Sign up</Button>
            </form>
        </div>
          </Modal>

                <Modal
                    open={openSingIn}
                    onClose={() => setOpenSignIn (false)}
                >
                  <div style={modalStyle} className={classes.paper}>
                  <form className="app__signup">
                <center>
                  <img 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" 
                  className="app-headerImage"
                  />
                </center>
                  <Input
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)
                  }>
                  </Input>
                  <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)
                  }>
                  </Input>

               
                <Button type="submit" onClick={signIn}>Sign in</Button>
            </form>
        </div>
          </Modal>

        <div className="app-headerImg">
          <img 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" 
          className="app-headerImage"
          />
           {user ? (
                   <Button onClick={() => auth.signOut()}>Logout</Button>
                  ) : (
                    <div className="app__loginContainer">
                    <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
                    <Button onClick={() => setOpen(true)}>Sign up</Button>
                    </div>
                  )
                } 

        </div>

        <div className="app__posts">
          <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
          </div>
          <div className="app__postsRight">
            <InstagramEmbed
              className="imported-ember-img"
              url='https://www.instagram.com/p/CECkDtOFxnm/'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
          </div>

        </div>

        {user?.displayName ? ( // optional change
           <ImageUpload username={user.displayName} />
          ) : (
            <h3>Sorry you need to login to Upload</h3>
          )
        }

        {/* <Post username="Telis Nt" caption=": 2nd best dev behind Petro" imageUrl="https://www.denofgeek.com/wp-content/uploads/2019/02/mcu-1-iron-man.jpg?resize=768%2C432"/>
        <Post username="Petros manesis" caption=": I am first in everything" imageUrl='data:image/jpeg;base64,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'/>
        <Post username="Jason caragiorgos" caption=": wHO IS THIS weirdo above" imageUrl="https://sm.askmen.com/askmen_gr/seo/1/11188/11188_ua7d.jpg"/> */}

    </div>
  );
}

export default App;
