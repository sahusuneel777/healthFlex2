import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

import uuid from 'react-native-uuid';
import { commentStore } from '../redux'
import globalStyles from '../style/globalstyles'
import moment from 'moment';

const commentsFormSkeleton = [{
    "name": "name",
    "placeholder": "Name",
    "value": null,
    "key": "observed_time",
    "required": true,
    "valid": false,
    "visible": true,
    "focus": false,
    "disabled": false,
    "element": "input",
    "keyboard_type": "default",
    "errors": [],
    "icon": "user",
    "classname": [{ width: '80%' }]
}, {
    "name": "comment",
    "placeholder": "Comment",
    "value": null,
    "required": true,
    "visible": true,
    "focus": false,
    "valid": false,
    "disabled": false,
    "animated": false,
    "element": "textarea",
    "keyboard_default": "default",
    "errors": [],
    "icon": "lock"
}]

const Form = (props) => {
    const [formSchema, setFormSchema] = useState(JSON.parse(JSON.stringify(props.formSkeleton)))
    const [refresher, setRefresher] = useState(false)
    const [username,setUsername] = useState("")
    const [comment,setComment] = useState("")

    useEffect(() => {
        setFormSchema(JSON.parse(JSON.stringify(props.formSkeleton)))
    }, [])

    function onHandleChange(ele, text) {
        formSchema.map((feild, key) => {
            let { events } = feild;
            if (feild['name'] === ele['name']) {
                if(ele['name'] == "name"){
                    setUsername(text)
                }else{
                    setComment(text)
                }
                feild['value'] = text;
                console.log("chanegd valeu",text, feild['value'])
            }
        })
        setFormSchema(formSchema)
    }

    function autoValidateCommentSFormInfo(formSchema) {
        let final_errors = []
        formSchema.map((feild, key) => {
            if (
                feild["value"] === null ||
                feild["value"] === "" ||
                feild["value"] === undefined
            ) {
                final_errors.push(true);
            }

        })
        setFormSchema(formSchema)
        return final_errors
    }

    function getData() {
        let comments = commentStore.getState()
        let obj = {}

        formSchema.map(ele => {
            obj[ele['name']] = ele['value']
        })
        obj['datetime'] = moment()
        obj['id'] = uuid.v4()

        return obj
    }

    function onFormsubmit() { //called on submit 
        let final_errors = autoValidateCommentSFormInfo(formSchema)
        if (!final_errors.includes(true)) {
            let commentsData = getData(formSchema)
            // console.log("73", commentsData)

            if (props.mode == "reply") {
                if (props.replyForCommentId) { // only for replys
                    commentStore.dispatch({ 'type': 'assign_reply', data: { ...commentsData, 'reply_to_id': props.replyForCommentId } })
                    props.closeReplyDialogue()
                } else { // for post.
                    commentStore.dispatch({ 'type': 'assign', data: commentsData })
                }
            } else if (props.mode == "edit") {
                if (props.editObj.reply_to_id) {
                    commentStore.dispatch({ 'type': 'update_reply', data: { ...commentsData, "reply_to_id":props.editObj.reply_to_id, "id": props.editObj.id} })
                    props.closeEditDialogue()
                } else {
                    commentStore.dispatch({ 'type': 'update', data: { ...commentsData, "id": props.editObj.id} })
                    props.closeEditDialogue()
                }
            }else{
                commentStore.dispatch({ 'type': 'assign', data: commentsData })
            }


            setFormSchema(JSON.parse(JSON.stringify(props.formSkeleton)))
            setUsername("")
            setComment("")
            setRefresher(!refresher)
        } else {
            alert('Validation failed.Please enter all fields.')
        }
    }

    return (
        <View style={[globalStyles.container,{width:'95%'}]}>
            <Text style={styles.textBold}>{props.replyForCommentId ? 'Reply' : "Comment"}</Text>
            {formSchema?.map(((feild, fkey) => {
                if (feild.visible && feild.element == "input") {
                    return <TextInput
                            placeholder={feild.placeholder}
                            key={fkey}
                            editable={!feild.disabled}
                            style={styles.input}
                            onChangeText={(text) => onHandleChange(feild, text)}
                            value={feild['value']} //username
                        />

                } else if (feild.visible && feild.element == "textarea") {
                    return <TextInput
                            placeholder={props.replyForCommentId ? 'Reply' : "Comment"}
                            key={fkey}
                            multiline
                            style={styles.input}
                            onChangeText={(text) => onHandleChange(feild, text)}
                            value={feild['value']} //comment
                        />
                }
            }))}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>

                <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onFormsubmit}>
                    <Text style={styles.textSubmit}>POST</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default Form

const styles = StyleSheet.create({
    input: {
        textAlignVertical: "top",
        height: 40,
        margin: 10,
        borderWidth: 0,
        backgroundColor: '#fff',
        padding: 10,
        color: '#3e3939', fontSize: 14
    },
    button: {
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#1e74ad',
        paddingHorizontal: 20,
    },
    textBold: { color: '#616161', fontSize: 14, },
    textSubmit: {
        color: "white",
        // fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    }
})