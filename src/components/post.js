import React, { Component } from 'react'
import Modal from './modal'
import firebase from 'firebase'
import { toast } from 'react-toastify'
import uuid from 'uuid/v1'

class Post extends Component {

  constructor(props) {
    super(props)
    this.state = {
    image: null,
    loading: false,
    posts: [],
      classNameModal: '',
      errorForm: false,
      formData: {
        content:'',
        image: ''
      }
    }
  }

  handleModal = (classNameModal) => {
    this.setState({
      classNameModal
    })
  }

  handleClose = () => {
    this.setState({
      classNameModal: ''
    })
  }

  handleChange =(e) =>{
    let{
      formData
    }=this.state

    let{
      target
    } = e

    if (target.type === "file"){
      formData[target.name] = target.files[0]

    } else{
      formData[target.name] = target.value
    }

    this.setState({
      formData,
      errorForm: false
    })

  }

  handleSubmit =(e)=>{
    e.preventDefault()
    
    let {
      formData
    } = this.state

    if (formData.content && formData.image){
      this.setState({
        loading: true
      }, this.handleUploadImage)
      //llamar subida de archivo
    } else{
      this.setState({
        errorForm: true
      })
    }

  }

  handleUploadImage = () =>{
    //subida del archivo y obtener url
    let{
      formData: {image}
    }= this.state

    let name = `${uuid()}-${image.name}`
    let refStorage = firebase.storage().ref(`/photos/${name}`)
    let task = refStorage.put(image)

    task.on('state_changed', (snapshot) =>{
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({
        progressUpload: percentage
      })
    }, (error) =>{
      console.error(error)
      this.setState({
        loading: false
      })

       // this.restartProgressBar()
        toast.error(`Error: ${error.message}`,{
          position: toast.POSITION.TOP_LEFT
          
        })
    }, () => {
      task.snapshot.ref.getDownloadURL().then((url) =>{
        this.handleCreatePost(url)
        })
      })
  }

  handleCreatePost =(url) =>{
    //crear post con la url
    let{
      formData: {content}
    }= this.state

    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
      content,
      photoURL: url,
      authorId: 'yXGJRg9tHoWTqmX8KwDOWdtNtNh2',
      createdAt: new Date().toJSON()
    })

    this.setState({
      classNameModal:'',
      loading: false,
      formData: {
        content:'',
        image: ''
      }
      })
  }

  restartProgressBar = () =>{
    this.setState({
      progressUpload: 0
    })
  }

  render() {

    let {
      classNameModal,
      formData,
      errorForm,
    } = this.state

    return (
      <div>
        <button
          onClick={
            () => this.setState({
              classNameModal: 'is-active'
            })
          }
          className="button is-success">
          New Post
                </button>

        <Modal
          className={classNameModal}
          title="Nuevo post"
          onClose={() => this.handleModal('')}
        >

          {
            errorForm && (<div className="notification is-danger">
              Completa los campos del formulario
            </div>)
          }

          <form 
          onSubmit={this.handleSubmit}
          
          >
            <div className="field">
              <label className="label">
                Titulo
                            </label>
              <div className="control">
                <input 
                type="text"
                onChange={this.handleChange}
                name="content"
                value={
                  formData.content
                }
                className="input is-info" />
              </div>
            </div>

            <div className="file has-name">
              <label className="file-label">
                <input
                  onChange={this.handleChange}
                  className="file-input"
                  type="file"
                  name="image"
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>

                  {
                    formData.image ? (<span>
                      {
                      formData.image.name
                      }
                      </span>) : (<span className="file-label">
                        Selecciona una foto...
                      </span>)
                  }

                </span>
              </label>
            </div>
                
                <div className="column">
                  <div className="buttons">
                    <button 
                    type="button"
                    onClick={
                      ()=> this.handleModal('')
                    }
                    className="button is-danger">
                      Cancelar
                    </button>
                    <button 
                    
                    className="button is-success">
                      Publicar 
                    </button>
                  </div>
                </div>
              
          </form>
        </Modal>
      </div>
    )
  }
}

export default Post
