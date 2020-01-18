import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'

class PostCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            author: null,
            loading: true,
            comment: ''

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
    
    handleSubmit =(e) =>{
        e.preventDefault()
        const {
            comment
        } = this.state

        const{
            post
        }= this.props

        if (comment){
            let comments = firebase.database().ref(`postComments/${post.id}`)
            let refComment = comments.push()
        refComment.set({
            content: comment,
            userId: 'yXGJRg9tHoWTqmX8KwDOWdtNtNh2',
            createdAt: new Date().toJSON()
        })
        }
        this.setState({
            comment:''
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
            comment
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
                    <img src={post.photoURL} />
                </figure>
            </div>

            {
                !readOnly && (<div className="card-footer">
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
                                placeholder="Escribe un comentario"
                                className="input"
                            />
                        </div>
                        <p className="control">
                                <button 
                                className="button is-info">
                                    Enviar
                                </button>
                        </p>
                    </div>
                </form>
                    </div>)
            }

        </div>)
    }
}

export default PostCard