import { createStore, applyMiddleware } from 'redux'; //On va créer un store redux pur holds application state
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk'; //Il sera notre middleware d'application  c'est par lui qu'il passe une fonction en action
import rootReducer from './reducers'; //on aura un reducer pour auth et pour chaque changement en profile (experience education)

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
