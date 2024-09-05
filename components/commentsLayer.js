import { View, Text, ScrollView, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { commentStore } from '../redux'
import globalStyles from '../style/globalstyles'
import AntDesign from '@expo/vector-icons/AntDesign';
import Form from './form';
import moment from 'moment/moment';
import commentsFormSkeleton from '../formschema';


const CommentsLayer = () => {
    const [commetsData, setCommentsData] = useState([])
    const [replyForCommentId, setReplyForCommentId] = useState(null)
    const [isReply, setIsReply] = useState(false) // for reply to the comment
    const [isEditReply, setIsEditReply] = useState(false) //for edit of a comment reply
    const [formfieldSchema, setFormFieldSchema] = useState(JSON.parse(JSON.stringify(commentsFormSkeleton)))
    const [editForCommentReplyId, setEditForCommentReplyId] = useState(null)
    const [sortDescendingOrder, setSortDescendingOrder] = useState(true) //state deciding sort method

    useEffect(() => {
        setFormFieldSchema(JSON.parse(JSON.stringify(commentsFormSkeleton)))
        const unsubscribe = commentStore.subscribe(() => {
            console.log("store", commentStore.getState())
            setCommentsData(commentStore.getState());
        });

        return () => {
            unsubscribe();
        };

    }, [])

    function onPressDelete(data) {
        if (data['reply_to_id']) {
            commentStore.dispatch({ 'type': 'delete_reply', data: data })
        } else {
            commentStore.dispatch({ 'type': 'delete', data: data })

        }

    }

    function onPressEditComment(data) {
        // console.log("44",data)
        formfieldSchema.map((field, fkey) => {
            if (field.name == "comment") {
                field.value = data.comment
            } else if (field.name == "name") {
                field.value = data.name
                field.disabled = true
            }
        })
        // console.log("formfieldSchema",formfieldSchema)
        setFormFieldSchema(formfieldSchema)
        setIsEditReply(true)
        setEditForCommentReplyId(data.id)
    }

    function closeDialogue() {
        setReplyForCommentId(null)
        setEditForCommentReplyId(null)
        setFormFieldSchema(JSON.parse(JSON.stringify(commentsFormSkeleton)))

    }

    function sortBasedOnDatetime() {
        let sortedComentsData = []
        if (sortDescendingOrder) {
            sortedComentsData = commetsData?.sort((a, b) => b.datetime - a.datetime);
        } else {
            sortedComentsData = commetsData?.sort((a, b) => a.datetime - b.datetime);
        }

        setCommentsData(sortedComentsData)
        setSortDescendingOrder(!sortDescendingOrder)
    }

    function Filter() {
        return <View style={[globalStyles.rowView, { justifyContent: 'flex-end' }]}>
            <TouchableOpacity style={[globalStyles.rowView, { alignItems: 'center' }]} onPress={() => sortBasedOnDatetime()}>
                <Text>Sort by: Date and Time </Text>
                {sortDescendingOrder ? <AntDesign name="arrowdown" size={14} color="#000" /> : <AntDesign name="arrowup" size={14} color="#000" />}
            </TouchableOpacity>
        </View>
    }

    function Item(props) {
        let { comment, type } = props
        return <View key={comment.id} style={{ backgroundColor: '#fff' }}>
            <View style={[globalStyles.container, { width: '95%' }]}>
                <View style={[globalStyles.rowView, { justifyContent: 'space-between' }]}>
                    <Text style={globalStyles.boldText}>{comment.name}</Text>
                    <Text>{moment(comment.datetime).format("Do MMM YYYY")}</Text>
                </View>
                <View style={[globalStyles.rowView, { justifyContent: 'space-between' }]}>
                    <Text>{comment.comment}</Text>
                    <TouchableOpacity style={{ backgroundColor: 'grey', padding: 5, overflow: 'visible', borderRadius: 20, position: 'absolute', right: -20 }} onPress={() => onPressDelete(comment)}>
                        <AntDesign name="delete" size={14} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    {type != "reply" && <TouchableOpacity style={{ marginRight: 15 }} activeOpacity={0.5} onPress={() => { setIsReply(true), setReplyForCommentId(comment.id) }}>
                        <Text style={globalStyles.blueText}>Reply</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity activeOpacity={0.5} onPress={() => onPressEditComment(comment)}>
                        <Text style={globalStyles.blueText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {replyForCommentId == comment.id && <Form mode={'reply'} formSkeleton={formfieldSchema} closeReplyDialogue={closeDialogue} replyForCommentId={replyForCommentId} />}

            <View style={{ marginLeft: 20 }}>{comment.replies?.map((eachReply, key) => <Item comment={eachReply} type={'reply'} key={key} />)}</View>
            {editForCommentReplyId == comment.id && <Form editObj={comment} mode={'edit'} formSkeleton={formfieldSchema} closeEditDialogue={closeDialogue} editForCommentReplyId={editForCommentReplyId} />}
        </View>
    };

    function ListEmptyView() {
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={globalStyles.boldText}>No Data Found.</Text>
        </View>
    }


    return (
        <React.Fragment>
            {commetsData?.length > 0 && <Filter />}
            {/* style={{ flex: 1 }} behavior="padding" */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* <View style={{ flex: 1 }}> */}
                    <FlatList
                        data={commetsData}
                        renderItem={({ item }) => <Item comment={item} />}
                        keyExtractor={item => item.id}
                        scrollEnabled={true}
                        ListEmptyComponent={ListEmptyView}
                        contentContainerStyle={{ paddingBottom: 20 }} 
                    />
                {/* </View> */}
            </KeyboardAvoidingView>

        </React.Fragment>
    )
}

export default CommentsLayer