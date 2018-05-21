import { combineReducers } from 'redux';

//featuredTopicPage contains the information needed for the featured topic
//on the Topic Page
const featuredTopicPage = (state = [], action) => {

    //sets state of featuredTopicPage to an array of objects where each object is a section
    //of the topic edit page e.g. one object would be the Topic Title, another
    //object would be Topic Summary, etc.
    if (action.type === 'SET_FEATURED_TOPIC_TOPIC_PAGE'){
        return action.payload
    }

    //if action 'SET_FEATURED_TOPIC_TOPIC_PAGE' is not received, state is set to its 
    //default empty array
    return state
}

//featuredLandingPage contains the information needed to display the featured topic
//the featured topic on the landing page
const featuredLandingPage = (state = [], action) => {

    //sets state of featuredLandingPage to an array of objects where each object is a section
    //of the featured topic on the landing page e.g. contributor names, contributor bios, etc.
    if(action.type === 'SET_FEATURED_TOPIC_LANDING_PAGE'){
        return action.paylod
    }

    //if action 'SET_FEATURED_TOPIC_LANDING_PAGE' is not received, state is set to its 
    //default empty array
    return state
}

const archivedTopics = (state = [], action) => {

    //sets state of archivedTopics to an array of objects where those objects are 
    //all archived topics
    if(action.type === 'SET_ARCHIVED_TOPICS'){
        return action.payload
    }

    //if action 'SET_ARCHIVED_TOPCS' is not received, state is set to its default 
    //empty array
    return state
} 

const comments = (state = [], action) => {
    if(action.type === 'SET_COMMENTS'){
        return action.payload
    }

    //if action 'SET_COMMENTS' is not received, state is set to its default empty array
    return state
}

export default combineReducers({
    featuredTopicPage,
    featuredLandingPage,
    archivedTopics,
    comments
})