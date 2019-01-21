import React from "react";
import { Modal, Button } from "react-bootstrap";
import * as filesService from '../../../services/files.service';
import {uuidv4} from '../../../utils/uuid';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';

class EditProfileImageModal extends React.Component{
    constructor(props){
        super(props);
            this.state ={
                show: false,
                onSelectImage: "",
                file: {},
                imageUrl: "",  
                selected: false
            }
        this.handleClose = this.handleClose.bind(this);
        this.modalLauncher = this.modalLauncher.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleClose(){
        this.setState({ 
            show: false, 
            imageUrl: ""
        });
    }

    modalLauncher(){
        this.setState({show: true})
        const that = this;
        if (this.props.imageUrl){
            axios({
                type: "GET",
                url: this.props.imageUrl,
                responseType: "blob"
            })
            .then(function(response) {
                var reader = new FileReader();
                reader.readAsDataURL(response.data);
                setTimeout(()=> {
                    that.setState({
                        imageUrl: reader.result,
                    });    
                }, 1000)
            })    
        }
    }
    
    onSelectImage(e){
        this.setState({
            imageUrl: URL.createObjectURL(e.target.files[0]),
            selected: true
        })  
    }
    
    onSubmit(){
        let canvasScaled = "";
        let blob = {};
        if (this.editor){
            canvasScaled = this.editor.getImageScaledToCanvas();
            blob = canvasScaled.toBlob(blob => {
                this.setState({
                    file: blob,
                })  
                const file = this.editor ? blob : this.state.file
                const filename = uuidv4();
                const filetype = this.state.file.type
                const promise= filesService.getSignedUrl(filename, filetype, file)
                promise
                .then(response =>{
                    this.props.onImageChange(response)
                    this.setState({
                        imageUrl: response,
                        show: false,
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            })
        }
    }

    setEditorRef = (editor) => this.editor = editor

    render(){
        let currentImage = this.state.imageUrl;
        return(
            <React.Fragment>
                <a onClick={this.modalLauncher} className="zmdi zmdi-camera profile__img__edit"></a>
                <Modal show={this.state.show} animation={false} onHide={this.handleClose}>

                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile Picture</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div class="profile__img">
                            <AvatarEditor
                                ref={this.setEditorRef}
                                image={currentImage}
                                width={200}
                                height={200}
                                border={50}
                                scale={this.state.zoomLevel}
                              />
                            <input
                                type="file"
                                name="file"
                                step = "0.01"
                                onChange={this.onSelectImage}
                                style={{ display: "none" }}
                                ref={fileInput => this.fileInput = fileInput}/>
                            <a onClick={() => this.fileInput.click()} className="zmdi zmdi-camera profile__img__edit"></a>
                        </div>
                        <div>
                            Zoom: <input name="scale" type="range" min="0.5" step="0.1" max="2" value={this.state.zoomLevel} 
                            onChange={e=> this.setState({zoomLevel: e.target.value})}/>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <button type="button" className="btn btn-outline-danger" onClick={this.handleClose} style={{margin: 5 + "px"}}>Close</button> 
                        <button type="button" className="btn btn-light" onClick={() => this.fileInput.click()} style={{margin: 5 + "px"}}>Select an Image</button>
                        <button type="button" className="btn btn-light" onClick={this.onSubmit} style={{margin: 5 + "px"}}>Upload the Photo</button>
                
                    </Modal.Footer>
              
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditProfileImageModal;
