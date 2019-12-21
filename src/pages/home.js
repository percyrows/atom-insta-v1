import React, {Component} from 'react'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar'
import { toast } from 'react-toastify'


class Home extends Component {
  constructor (props){
    super(props)
    this.state ={
      image: null,
      progressUpload: 0,
      posts: []
    }
  }

  componentDidMount = () => {
    let postsRef = firebase.database().ref('posts')

    postsRef.on("value", (snapshot) =>{
      let posts = snapshot.val()
      let newPosts= []

      console.log(posts)
    
      for(let post in posts){
        newPosts.push({
          id: post,
          content: posts[post].content,
          photoUrl: posts[post].photoUrl
        })
      }
        this.setState({
        posts: newPosts
      })   
    })
  }

  addPost = () =>{
    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
      content: `Hola ${new Date().toDateString()}`,
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/atom-insta-v1.appspot.com/o/photos%2FSat%20Dec%2021%202019-AdobeStock_297515298.jpeg?alt=media&token=eaf04c84-06a4-451b-87b7-4075b76c92e5',
      createdAt: new Date().toJSON()
    })
  }

  handleChange = (e) =>{
    let [image] = e.target.files

    this.setState({
      image
    })

    let name = `${new Date().toDateString()}-${image.name}`

    let refStorage = firebase.storage().ref(`/photos/${name}`)
    let task = refStorage.put(image)

    task.on('state_changed', (snapshot) =>{
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        progressUpload: percentage
      })
    }, (error) =>{
      console.error(error)
        this.restartProgressBar()
        toast.error(`Error: ${error.message}`,{
          position: toast.POSITION.TOP_LEFT
          
        })
    }, () => {
      task.snapshot.ref.getDownloadURL().then((url) =>{
        toast.success("Carga Completa !", {
          position: toast.POSITION.TOP_RIGHT
        })
        console.log(url)
      })
    })
  }

    restartProgressBar = () =>{
      this.setState({
        progressUpload: 0
      })
    }

    render() {

      let{
        image,
        progressUpload,
        posts
      } = this.state


      return ( 
        <div>
          Wellcome

        <LoadingBar 
        progress={progressUpload}
        color="white"
        onLoaderFinished={this.restartProgressBar}
        />

        <button
        onClick={this.addPost}
        >
          New Post
        </button>


          
          <div className="file has-name">
            <label className="file-label">
              <input 
              onChange={this.handleChange}
              className="file-input" 
              type="file" 
              name="resume"
              />
              <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">
                    Selecciona una foto...
                  </span>
              </span>
              {
                image ? (<span className="file-name">
                  {image.name}
              </span>) : null
              }
            </label>
          </div>

         <div className="columns is-multiline">
         {
            posts.map(l =>{
              return(
                <div key={l.id} className="column is-4">
                  <img src={l.photoUrl} />
                </div>
              )
            })
          }
         </div>

        </div>
      );
    }
  }
  
  export default Home;