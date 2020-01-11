import React, { Component } from 'react'
import firebase from 'firebase'

class PostCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            author: null,
            loading: true

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

    render() {

        let {
            post,
        } = this.props

        let {
            author,
            loading
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
                            <p class="title is-4">{author.displayName}</p>
                            <p class="subtitle is-6">@Uriel</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="card-image">
                <figure className="image is-4by3">
                    <img src={post.photoURL} />
                </figure>
            </div>
        </div>)
    }
}

export default PostCard