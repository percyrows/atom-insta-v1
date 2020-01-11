import React, {Component} from 'react'
import firebase from 'firebase'
import Post from '../components/post'
import PostCard from '../components/post-card'



class Home extends Component {
  constructor (props){
    super(props)
    this.state ={
    posts: []
    }
  }

  componentDidMount = () => {
    let postsRef = firebase.database().ref('posts')

    postsRef.on("value", (snapshot) =>{
      let posts = snapshot.val()
      let newPosts= []
    
      for(let post in posts){
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoURL: posts[post].photoURL,
          authorId: posts[post].authorId,
          createdAt: posts[post].createdAt,
        })
      }
        this.setState({
        posts: newPosts
      })   
    })
  }
    render() {
      let{
        posts
      } = this.state

      return (
        <div>
          Wellcome
          <Post/>
        {
          posts.map((p,i)=>{
            return <PostCard
            post={p}
            key={i}
            />
          })
        }
        </div>
      )
    }
  }
  
  export default Home;