import { createStore } from 'redux'

function commentsReducer(state = [], action) {
    let { data } = action;
    // console.log("data", data)
    switch (action.type) {
        case 'assign':
            let new_state_array = []
            new_state_array = state.concat([data]);
            return new_state_array;
        case 'assign_reply':
            // console.log("12",data)
            new_state_array = []
            let is_comment_exists = state.find(e => e.id == data.reply_to_id)
            // console.log("15is_comment_exists",is_comment_exists)
            if (is_comment_exists.replies) {
                is_comment_exists.replies.push(data);
            } else {
                is_comment_exists.replies = [data];
            }
            new_state_array = state.map(each => {
                if (is_comment_exists.id == each.id) {
                    return is_comment_exists;
                }
                return each
            })
            return new_state_array;
        case 'update':
            is_comment_exists = state.findIndex(e => e.id == data.id)
            // new_state_array = state
            // if (is_comment_exists !== -1) {
            //     console.log("presrnt state",state)
            //     
            //     new_state_array[is_comment_exists] = {...data};
            //     console.log("ypdated state",new_state_array, state)

            // }

            // return new_state_array

            new_state_array = state.map(eachComment => {
                if (eachComment.id === data.id) {
                    return { ...eachComment, name: data.name, comment:data.comment };
                }
                return eachComment;
            });
            return new_state_array
        case 'update_reply':
            new_state_array = state.map(eachComment => {
                if (eachComment.id === data.reply_to_id) {
                    // Update replies if the comment id matches
                    const updatedReplies = eachComment.replies.map(eachReply => {
                        if (eachReply.id === data.id) {
                            return { ...eachReply, ...data };
                        }
                        return eachReply;
                    });
            
                    return { ...eachComment, replies: updatedReplies };
                }
                return eachComment;
            });
            return new_state_array
        case 'delete':
            new_state_array = state.filter(e => e.id != data.id)
            return new_state_array;
        case 'delete_reply':
            is_comment_exists = state.find(e => e.id == data.reply_to_id)
            new_state_array = state.map(each => {
                if (is_comment_exists.id == each.id) {
                    let modifiedReplies = is_comment_exists.replies?.filter(reply => reply.id != data.id)
                    is_comment_exists.replies = modifiedReplies
                    return is_comment_exists
                }
                return each;

            })
            return new_state_array;
        case 'empty':
            return []
        default:
            return state
    }

}

let commentStore = createStore(commentsReducer)


export {
    commentStore,
}




