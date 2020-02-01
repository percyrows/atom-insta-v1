import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import tree from '../tree'

class PostCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author: null,
      user: tree.get("user"),
      loading: true,
      comment: '',
      placeholder: "Escribe un comentario",
      disabled: false

    }
  }

  componentDidMount = () => {
    this.loadAuthor()

  }

  loadAuthor = () => {
    let {
      post
    } = this.props

    let authorRef = firebase.database().ref(`users/${post.authorId}`)

    authorRef.on('value', (snapshot) => {
      console.log(snapshot.val())
      this.setState({
        author: snapshot.val(),
        loading: false
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      comment,
      user
    } = this.state

    const {
      post
    } = this.props

    if (comment) {

      this.setState({
        disabled: true
      })


      let comments = firebase.database().ref(`postComments/${post.id}`)
      let refComment = comments.push()
      refComment.set({
        content: comment,
        userId: user.id,
        createdAt: new Date().toJSON()
      })
    }
    this.setState({
      comment: '',
      placeholder: "comentario enviado"
    }, () => {
      setTimeout(() => {
        this.setState({
          placeholder: "escribe un comentario",
          disabled: false
        })
      }, 2000)
    })
  }

  render() {

    let {
      post,
      readOnly
    } = this.props

    let {
      author,
      loading,
      comment,
      placeholder,
      disabled
    } = this.state

    if (loading) {
      return <div>
        Cargando...
            </div>
    }

    return (<div className="card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="media">
            <div className="media-left">

              <figure className="image is-48x48">
                <img
                  alt=""
                  className="is-rounded"
                  src={author.photoURL} />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{author.displayName}</p>
              <p className="subtitle is-6">@Uriel</p>
            </div>
          </div>
        </div>

        <div
          className="card-header-icon">
          <div className="card-footer-item">
            <Link to={`/post/${post.id}`}>
              Ver Post
                        </Link>
          </div>

        </div>
      </div>
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            alt=""
            src={post.photoURL} />
        </figure>
      </div>

      <div className="footer-image is-vertical-center">
        <p>
        {
          post.content
        }
        </p>
      
      </div>

      <div className="card-footer">
        <form
          onSubmit={this.handleSubmit}
          className="card-footer-item">
          <div className="field is-grouped fields-comments">
            <div className="control is-expanded">
              <input
                value={comment}
                onChange={
                  (e) => {
                    this.setState({
                      comment: e.target.value
                    })
                  }
                }
                placeholder={placeholder}
                className="input"
                disabled={disabled}
              />


            </div>
            <p className="control">
              <button
                disabled={disabled}
                className="button is-info">
                Enviar
                                </button>
            </p>
          </div>
        </form>
      </div>

    </div>)
  }
}

export default PostCard